from typing import List
from data_types import Member, Role, Project, ProjectType, TeamSize, Education, ExperienceYears, ExpertiseLevel
from recommender import TeamRecommender
import numpy as np
import itertools

PROJECT_TYPE_ENUM = [ProjectType.FREELANCE, ProjectType.RESEARCH, ProjectType.ACADEMIC, ProjectType.HACKATHON]
TEAM_SIZE_ENUM = [TeamSize.OneThree, TeamSize.FourSix, TeamSize.SevenPlus]
EDUCATION_ENUM = [Education.NO_DEGREE, Education.BACHELOR, Education.MASTER, Education.PHD]
EXPERIENCE_YEARS_ENUM = [
    ExperienceYears.ZERO_TO_ONE, ExperienceYears.ONE_TO_THREE, ExperienceYears.THREE_TO_FIVE,
    ExperienceYears.FIVE_TO_SEVEN, ExperienceYears.SEVEN_TO_TEN, ExperienceYears.MORE_THAN_TEN
]
EXPERTISE_LEVEL_ENUM = [
    ExpertiseLevel.ENTRY, ExpertiseLevel.JUNIOR, ExpertiseLevel.MID, ExpertiseLevel.SENIOR, ExpertiseLevel.RESEARCHER
]

def encode_enum(value, enum_list):
    return [int(value == enum_val) for enum_val in enum_list]

def extract_team_features_rich(team_members: List[Member], roles: List[Role], project: Project = None):
    """
    Extract a rich set of features from a team for ML training/prediction.
    Args:
        team_members: List of Member objects (the team)
        roles: List of Role objects (project roles)
        project: Project object (optional, for projectType/teamSize features)
    Returns:
        features: List of feature values
    """
    # Skills
    all_team_skills = set(itertools.chain.from_iterable(m.technologies for m in team_members))
    all_required_skills = set(itertools.chain.from_iterable(r.technologies for r in roles))
    skill_coverage = len(all_required_skills & all_team_skills) / len(all_required_skills) if all_required_skills else 0.0
    unique_skills = len(all_team_skills)
    avg_skills_per_member = np.mean([len(m.technologies) for m in team_members])
    
    # Roles
    team_roles = set(m.position for m in team_members)
    required_roles = set(r.roleName for r in roles)
    role_coverage = len(required_roles & team_roles) / len(required_roles) if required_roles else 0.0
    unique_roles = len(team_roles)
    
    # Diversity
    companies = set()
    educations = set()
    for m in team_members:
        if m.work_experience:
            companies.add(m.work_experience[0].company)
        else:
            companies.add("Unknown")
        educations.add(m.education)
    company_diversity = len(companies) / len(team_members)
    # Education diversity (as one-hot mean)
    education_encoded = np.mean([encode_enum(m.education, EDUCATION_ENUM) for m in team_members], axis=0).tolist()
    education_diversity = len(educations) / len(team_members)
    
    # Experience (ordinal encoding for ExperienceYears)
    try:
        exp_values = [EXPERIENCE_YEARS_ENUM.index(m.experience_years) for m in team_members]
        avg_experience = np.mean(exp_values)
        std_experience = np.std(exp_values)
    except (ValueError, IndexError):
        avg_experience = 0.0
        std_experience = 0.0
    # Experience years diversity (as one-hot mean)
    experience_encoded = np.mean([encode_enum(m.experience_years, EXPERIENCE_YEARS_ENUM) for m in team_members], axis=0).tolist()
    # Expertise level diversity (as one-hot mean)
    expertise_encoded = np.mean([encode_enum(m.expertise_level, EXPERTISE_LEVEL_ENUM) for m in team_members], axis=0).tolist()
    
    # Skill overlap (average Jaccard similarity between all pairs)
    overlaps = []
    for m1, m2 in itertools.combinations(team_members, 2):
        s1, s2 = set(m1.technologies), set(m2.technologies)
        if s1 or s2:
            overlaps.append(len(s1 & s2) / len(s1 | s2))
    avg_skill_overlap = np.mean(overlaps) if overlaps else 0.0
    
    # Team size (number of members)
    team_size = len(team_members)
    
    # ProjectType and TeamSize one-hot encoding (if project is provided)
    project_type_encoded = encode_enum(project.projectType, PROJECT_TYPE_ENUM) if project else [0]*len(PROJECT_TYPE_ENUM)
    team_size_enum_encoded = encode_enum(project.teamSize, TEAM_SIZE_ENUM) if project else [0]*len(TEAM_SIZE_ENUM)
    
    return [
        skill_coverage,
        unique_skills,
        avg_skills_per_member,
        role_coverage,
        unique_roles,
        company_diversity,
        education_diversity,
        avg_experience,
        std_experience,
        avg_skill_overlap,
        team_size,
        *education_encoded,
        *experience_encoded,
        *expertise_encoded,
        *project_type_encoded,
        *team_size_enum_encoded
    ]

def generate_synthetic_team_data_rich(candidates: List[Member], roles: List[Role], recommender: TeamRecommender, project: Project = None, n_teams: int = 1000, team_size: int = 4):
    """
    Generate synthetic data for team quality prediction using rich feature extraction.
    Args:
        candidates: List of Member objects (candidate pool)
        roles: List of Role objects (project roles)
        recommender: TeamRecommender instance (for scoring)
        project: Project object (optional, for projectType/teamSize features)
        n_teams: Number of synthetic teams to generate
        team_size: Number of members per team
    Returns:
        X: List of feature vectors (rich features)
        y: List of labels (team quality scores)
    """
    import random
    X = []
    y = []
    for _ in range(n_teams):
        team_members = random.sample(candidates, min(team_size, len(candidates)))
        # Prepare team in the format expected by scoring (list of dicts)
        team = [{
            'member': m,
            'role': random.choice(roles).roleName,  # Assign a random role for synthetic data
            'role_match_score': 1.0  # Placeholder, not used in feature extraction
        } for m in team_members]
        # Extract rich features
        features = extract_team_features_rich(team_members, roles, project)
        X.append(features)
        # Use team_score as the label (or you can use a weighted sum of features)
        team_score = recommender._calculate_team_score(team, roles)
        y.append(team_score)
    return X, y 
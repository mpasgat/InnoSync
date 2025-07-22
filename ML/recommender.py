from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import itertools
from typing import List, Dict
from data_types import *
# from synthetic_data import generate_synthetic_team_data_rich
# from sklearn.ensemble import RandomForestRegressor

class TeamRecommender:
    """
    Team recommendation system that matches candidates to project roles
    based on skills, experience, and team synergy.
    """
    
    def __init__(self, candidates: List[Member]):
        """
        Initialize the recommender with candidate data.
        
        Args:
            candidates: List of available candidates
        """
        self.candidates = candidates
        self._prepare_skill_matrix()
        self._index_candidates_by_role()

    def _prepare_skill_matrix(self):
        """Prepare TF-IDF matrix for skill matching."""
        candidate_skills = [','.join(member.technologies) for member in self.candidates]
        self.tfidf = TfidfVectorizer(tokenizer=lambda x: x.split(','))
        self.skill_matrix = self.tfidf.fit_transform(candidate_skills)

    def _index_candidates_by_role(self):
        """Index candidates by their positions for faster role matching."""
        self.role_index = defaultdict(list)
        for idx, member in enumerate(self.candidates):
            self.role_index[member.position].append(idx)

    def recommend_team_with_synergy(self, project: Project, roles: List[Role], n_candidates: int = 5) -> Dict:
        """
        Recommend a team with synergy scoring.
        
        Args:
            project: Project details
            roles: Required roles for the project
            n_candidates: Maximum candidates per role
            
        Returns:
            Dictionary with team recommendation and synergy metrics
        """
        # Get basic team recommendation
        raw_recommendation = self._recommend_team(project, roles, n_candidates)
        team_members = [m['member'] for m in raw_recommendation['team']]

        # Calculate synergy metrics
        synergy = self._calculate_team_synergy(team_members)
        exp_variance = self._calculate_experience_variance(team_members)
        
        # Update synergy metrics with experience variance
        synergy['experience_variance'] = exp_variance
        
        # Calculate combined score
        updated_score = 0.7 * raw_recommendation['team_score'] + 0.3 * synergy['avg_synergy']

        return {
            **raw_recommendation,
            'synergy_metrics': synergy,
            'updated_team_score': round(updated_score, 2),
            'recommendation_notes': self._generate_recommendation_notes(synergy, exp_variance)
        }

    def _recommend_team(self, project: Project, roles: List[Role], max_candidates_per_role: int = 5) -> Dict:
        """
        Core team recommendation algorithm.
        
        Args:
            project: Project details
            roles: Required roles for the project
            max_candidates_per_role: Maximum candidates to consider per role
            
        Returns:
            Dictionary with team recommendation
        """
        required_roles = self._parse_required_roles(roles)
        team = []

        for role_name, count in required_roles.items():
            candidate_indices = self.role_index.get(role_name, [])
            if not candidate_indices:
                continue

            # Find the Role object for this role_name
            role_obj = next((r for r in roles if r.roleName == role_name), None)
            if not role_obj:
                continue

            # Calculate skill similarity
            role_skills_text = ','.join(role_obj.technologies)
            role_vector = self.tfidf.transform([role_skills_text])
            role_skill_matrix = self.skill_matrix[candidate_indices]
            similarities = cosine_similarity(role_vector, role_skill_matrix).flatten()

            # Select top candidates
            top_indices = np.argsort(similarities)[-max_candidates_per_role:][::-1]
            selected = 0
            
            for idx in top_indices:
                if selected >= count:
                    break
                candidate_idx = candidate_indices[idx]
                candidate = self.candidates[candidate_idx]
                team.append({
                    'member': candidate,
                    'role': role_name,
                    'role_match_score': float(similarities[idx])
                })
                selected += 1

        # Calculate team score
        team_score = self._calculate_team_score(team, roles) if team else 0

        return {
            'team': team,
            'team_score': team_score,
            'project_details': project
        }

    def _parse_required_roles(self, roles: List[Role]) -> Dict[str, int]:
        """Count how many members are needed per role."""
        role_counts = defaultdict(int)
        for role in roles:
            role_counts[role.roleName] += 1
        return dict(role_counts)

    def _calculate_team_score(self, team: List[Dict], roles: List[Role]) -> float:
        """Calculate overall team score based on skill match, coverage, and diversity."""
        if not team:
            return 0
            
        # Average role match score
        avg_score = sum(m['role_match_score'] for m in team) / len(team)
        
        # Skill coverage
        all_required_skills = set(itertools.chain.from_iterable(r.technologies for r in roles))
        coverage = self._calculate_skill_coverage(all_required_skills, team)
        
        # Team diversity
        diversity = self._calculate_team_diversity(team)
        
        # Weighted combination
        return 0.5 * avg_score + 0.3 * coverage + 0.2 * diversity

    def _calculate_skill_coverage(self, required_skills: set, team: List[Dict]) -> float:
        """Calculate what percentage of required skills are covered by the team."""
        covered = set()
        for member_data in team:
            member = member_data['member']
            covered.update(member.technologies)
        return len(required_skills & covered) / len(required_skills) if required_skills else 0.0

    def _calculate_team_diversity(self, team: List[Dict]) -> float:
        """Calculate team diversity based on companies and experience levels."""
        # Company diversity
        companies = set()
        for m in team:
            if m['member'].work_experience:
                companies.add(m['member'].work_experience[0].company)
            else:
                companies.add("Unknown")
        company_diversity = len(companies) / len(team)
        
        # Experience level diversity
        exp_levels = set()
        for m in team:
            exp_enum = m['member'].expertise_level
            if exp_enum in [ExpertiseLevel.ENTRY, ExpertiseLevel.JUNIOR]:
                exp_levels.add('Junior')
            elif exp_enum == ExpertiseLevel.MID:
                exp_levels.add('Mid')
            elif exp_enum in [ExpertiseLevel.SENIOR, ExpertiseLevel.RESEARCHER]:
                exp_levels.add('Senior')
        exp_diversity = len(exp_levels) / 3
        
        return 0.6 * company_diversity + 0.4 * exp_diversity

    def _calculate_team_synergy(self, team_members: List[Member]) -> Dict:
        """Calculate team synergy using Jaccard similarity and experience balance."""
        if len(team_members) < 2:
            return {
                'avg_synergy': 0.0,
                'shared_skills': 0.0,
                'experience_variance': 0.0
            }
            
        synergy_scores = []
        skill_overlaps = []

        for pair in itertools.combinations(team_members, 2):
            member1, member2 = pair

            # Skill overlap using Jaccard similarity
            skills1 = set(member1.technologies)
            skills2 = set(member2.technologies)
            jaccard = len(skills1 & skills2) / len(skills1 | skills2) if (skills1 | skills2) else 0

            # Experience balance (ordinal encoding for ExperienceYears enum)
            exp_order = [
                ExperienceYears.ZERO_TO_ONE,
                ExperienceYears.ONE_TO_THREE,
                ExperienceYears.THREE_TO_FIVE,
                ExperienceYears.FIVE_TO_SEVEN,
                ExperienceYears.SEVEN_TO_TEN,
                ExperienceYears.MORE_THAN_TEN
            ]
            try:
                exp1 = exp_order.index(member1.experience_years)
                exp2 = exp_order.index(member2.experience_years)
            except ValueError:
                exp1 = exp2 = 0
            exp_diff = abs(exp1 - exp2)
            exp_penalty = np.exp(-0.1 * exp_diff)

            # Combined synergy score
            synergy = 0.7 * jaccard + 0.3 * exp_penalty
            synergy_scores.append(synergy)
            skill_overlaps.append(len(skills1 & skills2))

        return {
            'avg_synergy': round(np.mean(synergy_scores), 2),
            'shared_skills': round(np.mean(skill_overlaps), 1)
        }

    def _calculate_experience_variance(self, team_members: List[Member]) -> float:
        """Calculate variance in team experience levels using ordinal encoding for ExperienceYears enum."""
        exp_order = [
            ExperienceYears.ZERO_TO_ONE,
            ExperienceYears.ONE_TO_THREE,
            ExperienceYears.THREE_TO_FIVE,
            ExperienceYears.FIVE_TO_SEVEN,
            ExperienceYears.SEVEN_TO_TEN,
            ExperienceYears.MORE_THAN_TEN
        ]
        try:
            exp_values = [exp_order.index(m.experience_years) for m in team_members]
            return round(np.std(exp_values), 1)
        except (ValueError, IndexError):
            return 0.0

    def _generate_recommendation_notes(self, synergy: Dict, exp_variance: float) -> List[str]:
        """Generate human-readable recommendation notes."""
        notes = []
        
        if synergy['shared_skills'] > 0:
            notes.append(f"Team has {synergy['shared_skills']} shared skills on average")
        
        if exp_variance > 0:
            notes.append(f"Experience variance: {exp_variance} years")
            
        if synergy['avg_synergy'] > 0.5:
            notes.append("Strong team synergy detected")
        elif synergy['avg_synergy'] < 0.2:
            notes.append("Consider team building activities")
            
        return notes

import numpy as np
from synthetic_data import generate_synthetic_team_data_rich
from recommender import TeamRecommender
from data_types import Project, Role, Member, ProjectType, TeamSize, Education, ExperienceYears, ExpertiseLevel, Work
import random
import string

# --- Randomized Data Generation Utilities ---
def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters, k=length))

def random_technologies(n=3):
    techs = ["Python", "Java", "C++", "React", "Django", "Node.js", "SQL", "AWS", "Docker", "Kubernetes"]
    return random.sample(techs, k=n)

def random_work_experience():
    return [Work(
        startDate="2020-01-01",
        endDate="2022-01-01",
        position=random_string(5),
        company=random_string(6),
        description=random_string(15)
    )]

def random_member(id):
    return Member(
        id=id,
        bio=random_string(20),
        position=random.choice(["Backend", "Frontend", "Fullstack", "DevOps", "Data Scientist"]),
        education=random.choice(list(Education)),
        expertise=random_string(10),
        resume="resume.pdf",
        technologies=random_technologies(n=random.randint(2, 5)),
        expertise_level=random.choice(list(ExpertiseLevel)),
        experience_years=random.choice(list(ExperienceYears)),
        work_experience=random_work_experience()
    )

def random_role(id):
    return Role(
        id=id,
        roleName=random.choice(["Backend", "Frontend", "Fullstack", "DevOps", "Data Scientist"]),
        expertiseLevel=random.choice([e.value for e in ExpertiseLevel]),
        technologies=random_technologies(n=random.randint(2, 4))
    )

def random_project(id):
    return Project(
        id=id,
        title=f"Project {random_string(5)}",
        description=random_string(30),
        createdAt="2023-01-01",
        updatedAt="2023-06-01",
        projectType=random.choice(list(ProjectType)),
        teamSize=random.choice(list(TeamSize))
    )

# --- Main Data Generation Logic ---
NUM_PROJECTS = 10
NUM_CANDIDATES = 30
ROLES_PER_PROJECT = 4
TEAMS_PER_PROJECT = 200
TEAM_SIZE = 4

# Generate random candidates
candidates = [random_member(i) for i in range(1, NUM_CANDIDATES + 1)]

all_X, all_y = [], []
for pid in range(1, NUM_PROJECTS + 1):
    project = random_project(pid)
    roles = [random_role(i) for i in range(1, ROLES_PER_PROJECT + 1)]
    recommender = TeamRecommender(candidates)
    X, y = generate_synthetic_team_data_rich(
        candidates, roles, recommender, project=project, n_teams=TEAMS_PER_PROJECT, team_size=TEAM_SIZE
    )
    all_X.extend(X)
    all_y.extend(y)
    print(f"Generated for project {pid}: X={len(X)}, y={len(y)}")

np.save("data/X.npy", all_X)
np.save("data/y.npy", all_y)
print(f"Saved training data: X shape = {np.array(all_X).shape}, y shape = {np.array(all_y).shape}") 
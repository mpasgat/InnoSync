import pandas as pd
import random
from faker import Faker
from collections import defaultdict
fake = Faker()

# Configuration
NUM_CANDIDATES = 500
NUM_JOBS = 30
TEAM_SIZES = [3, 4, 5, 6]

# Skills and roles with weights
ROLES = {
    'Backend Engineer': {'weight': 0.25, 'skills': ['Python', 'Java', 'C++', 'SQL', 'API Design', 'Microservices']},
    'Frontend Engineer': {'weight': 0.2, 'skills': ['JavaScript', 'React', 'TypeScript', 'HTML/CSS', 'Redux']},
    'Full-Stack Engineer': {'weight': 0.15, 'skills': ['JavaScript', 'Python', 'React', 'Django', 'Node.js']},
    'DevOps Engineer': {'weight': 0.1, 'skills': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform']},
    'Data Engineer': {'weight': 0.08, 'skills': ['Python', 'SQL', 'Spark', 'ETL', 'Data Pipelines']},
    'Product Manager': {'weight': 0.07, 'skills': ['Product Strategy', 'Agile', 'Scrum', 'Market Research']},
    'UX Designer': {'weight': 0.05, 'skills': ['Figma', 'User Research', 'Prototyping', 'UI/UX']},
    'QA Engineer': {'weight': 0.05, 'skills': ['Testing', 'Automation', 'Selenium', 'JIRA']},
    'Data Scientist': {'weight': 0.05, 'skills': ['Python', 'Machine Learning', 'Statistics', 'Pandas']}
}

# Generate candidates
candidates = []
for i in range(NUM_CANDIDATES):
    role = random.choices(
        list(ROLES.keys()),
        weights=[r['weight'] for r in ROLES.values()],
        k=1
    )[0]
    
    base_skills = ROLES[role]['skills']
    extra_skills = random.sample([
        s for s in [
            'Git', 'REST', 'GraphQL', 'NoSQL', 'PostgreSQL', 
            'Azure', 'GCP', 'Jenkins', 'Kafka', 'Redis'
        ] if s not in base_skills
    ], random.randint(1, 3))
    
    candidates.append({
        'candidate_id': 1000 + i,
        'name': fake.name(),
        'role': role,
        'skills': ','.join(base_skills + extra_skills),
        'experience': random.randint(1, 15),
        'location': fake.city(),
        'current_company': fake.company(),
        'salary_expectation': random.randint(80, 220) * 1000
    })

candidates_df = pd.DataFrame(candidates)

# Generate team-based job postings
team_jobs = []
for i in range(NUM_JOBS):
    # Project types with typical team compositions
    project_types = [
        ('Web Application', {
            'Backend Engineer': 2,
            'Frontend Engineer': 2,
            'DevOps Engineer': 1,
            'Product Manager': 1
        }),
        ('Mobile App', {
            'Backend Engineer': 1,
            'Frontend Engineer': 3,
            'UX Designer': 1
        }),
        ('Data Platform', {
            'Data Engineer': 2,
            'Data Scientist': 2,
            'DevOps Engineer': 1
        }),
        ('Enterprise System', {
            'Backend Engineer': 3,
            'QA Engineer': 1,
            'DevOps Engineer': 1
        })
    ]
    
    project_name, team_composition = random.choice(project_types)
    required_roles = list(team_composition.keys())
    
    # Gather required skills
    required_skills = set()
    for role in required_roles:
        required_skills.update(ROLES[role]['skills'])
    
    team_jobs.append({
        'job_id': f"T{100+i}",
        'project_name': project_name,
        'project_description': fake.text(),
        'required_roles': ','.join(required_roles),
        'team_composition': ','.join(f"{k}:{v}" for k,v in team_composition.items()),
        'required_skills': ','.join(required_skills),
        'company': fake.company(),
        'location': fake.city(),
        'budget': f"${random.randint(500, 1200)}k",
        'duration': f"{random.randint(3, 12)} months"
    })

jobs_df = pd.DataFrame(team_jobs)

# Save data
candidates_df.to_csv('team_candidates.csv', index=False)
jobs_df.to_csv('team_jobs.csv', index=False)
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from typing import List

app = FastAPI(title="Mock Backend for ML API")

# Test data
TEST_PROJECT = {
    "id": 1,
    "title": "Test Web Application",
    "description": "A modern web application for testing the ML API",
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-01",
    "projectType": "Web Development",
    "teamSize": 3
}

TEST_ROLES = [
    {
        "id": 1,
        "roleName": "Frontend Developer",
        "expertiseLevel": "Mid",
        "technologies": ["React", "TypeScript", "CSS", "JavaScript"]
    },
    {
        "id": 2,
        "roleName": "Backend Developer",
        "expertiseLevel": "Senior",
        "technologies": ["Java", "Spring Boot", "PostgreSQL", "Docker"]
    },
    {
        "id": 3,
        "roleName": "DevOps Engineer",
        "expertiseLevel": "Mid",
        "technologies": ["Docker", "Kubernetes", "AWS", "Terraform"]
    }
]

TEST_CANDIDATES = [
    {
        "id": 1,
        "profile": {
            "bio": "Experienced frontend developer",
            "position": "Frontend Developer",
            "education": "Computer Science",
            "expertise": "React, TypeScript",
            "resume": "Frontend developer with 3 years experience",
            "technologies": [
                {"name": "React"},
                {"name": "TypeScript"},
                {"name": "CSS"},
                {"name": "JavaScript"}
            ],
            "expertiseLevel": "Mid",
            "experienceYears": "3 years",
            "workExperiences": [
                {
                    "startDate": "2021-01-01",
                    "endDate": "2023-12-31",
                    "position": "Frontend Developer",
                    "company": "Tech Corp",
                    "description": "Developed React applications"
                }
            ]
        }
    },
    {
        "id": 2,
        "profile": {
            "bio": "Senior backend developer",
            "position": "Backend Developer",
            "education": "Software Engineering",
            "expertise": "Java, Spring Boot",
            "resume": "Backend developer with 5 years experience",
            "technologies": [
                {"name": "Java"},
                {"name": "Spring Boot"},
                {"name": "PostgreSQL"},
                {"name": "Docker"}
            ],
            "expertiseLevel": "Senior",
            "experienceYears": "5 years",
            "workExperiences": [
                {
                    "startDate": "2019-01-01",
                    "endDate": "2023-12-31",
                    "position": "Backend Developer",
                    "company": "Enterprise Inc",
                    "description": "Built scalable backend services"
                }
            ]
        }
    },
    {
        "id": 3,
        "profile": {
            "bio": "DevOps engineer",
            "position": "DevOps Engineer",
            "education": "Information Technology",
            "expertise": "Cloud infrastructure",
            "resume": "DevOps engineer with 4 years experience",
            "technologies": [
                {"name": "Docker"},
                {"name": "Kubernetes"},
                {"name": "AWS"},
                {"name": "Terraform"}
            ],
            "expertiseLevel": "Mid",
            "experienceYears": "4 years",
            "workExperiences": [
                {
                    "startDate": "2020-01-01",
                    "endDate": "2023-12-31",
                    "position": "DevOps Engineer",
                    "company": "Cloud Solutions",
                    "description": "Managed cloud infrastructure"
                }
            ]
        }
    },
    {
        "id": 4,
        "profile": {
            "bio": "Full-stack developer",
            "position": "Full Stack Developer",
            "education": "Computer Science",
            "expertise": "React, Node.js, MongoDB",
            "resume": "Full-stack developer with 4 years experience",
            "technologies": [
                {"name": "React"},
                {"name": "Node.js"},
                {"name": "MongoDB"},
                {"name": "Express"},
                {"name": "TypeScript"}
            ],
            "expertiseLevel": "Mid",
            "experienceYears": "4 years",
            "workExperiences": [
                {
                    "startDate": "2020-01-01",
                    "endDate": "2023-12-31",
                    "position": "Full Stack Developer",
                    "company": "Startup Inc",
                    "description": "Built full-stack web applications"
                }
            ]
        }
    },
    {
        "id": 5,
        "profile": {
            "bio": "UI/UX Designer",
            "position": "UI/UX Designer",
            "education": "Design",
            "expertise": "Figma, Adobe Creative Suite",
            "resume": "UI/UX designer with 3 years experience",
            "technologies": [
                {"name": "Figma"},
                {"name": "Adobe XD"},
                {"name": "Sketch"},
                {"name": "CSS"},
                {"name": "HTML"}
            ],
            "expertiseLevel": "Mid",
            "experienceYears": "3 years",
            "workExperiences": [
                {
                    "startDate": "2021-01-01",
                    "endDate": "2023-12-31",
                    "position": "UI/UX Designer",
                    "company": "Design Studio",
                    "description": "Created user interfaces and experiences"
                }
            ]
        }
    }
]

@app.get("/api/projects/{project_id}")
def get_project(project_id: int):
    if int(project_id) == TEST_PROJECT["id"]:
        return JSONResponse(TEST_PROJECT)
    return JSONResponse({"detail": "Project not found"}, status_code=404)

@app.get("/api/projects/{project_id}/roles")
def get_project_roles(project_id: int):
    if int(project_id) == TEST_PROJECT["id"]:
        return JSONResponse(TEST_ROLES)
    return JSONResponse([], status_code=404)

@app.get("/api/users/profiles")
def get_candidates():
    return JSONResponse(TEST_CANDIDATES)

@app.get("/health")
def health():
    return {"status": "mock-backend-healthy"} 
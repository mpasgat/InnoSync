from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from enum import Enum

app = FastAPI(title="Mock Backend API", version="1.0")

# In-memory user store for auth
users = {}

class ProjectType(str, Enum):
    FREELANCE = "FREELANCE"
    RESEARCH = "RESEARCH"
    ACADEMIC = "ACADEMIC"
    HACKATHON = "HACKATHON"

class TeamSize(str, Enum):
    OneThree = "OneThree"
    FourSix = "FourSix"
    SevenPlus = "SevenPlus"

class Education(str, Enum):
    NO_DEGREE = "NO_DEGREE"
    BACHELOR = "BACHELOR"
    MASTER = "MASTER"
    PHD = "PHD"

class ExperienceYears(str, Enum):
    ZERO_TO_ONE = "ZERO_TO_ONE"
    ONE_TO_THREE = "ONE_TO_THREE"
    THREE_TO_FIVE = "THREE_TO_FIVE"
    FIVE_TO_SEVEN = "FIVE_TO_SEVEN"
    SEVEN_TO_TEN = "SEVEN_TO_TEN"
    MORE_THAN_TEN = "MORE_THAN_TEN"

class ExpertiseLevel(str, Enum):
    ENTRY = "ENTRY"
    JUNIOR = "JUNIOR"
    MID = "MID"
    SENIOR = "SENIOR"
    RESEARCHER = "RESEARCHER"

class Commitment(str, Enum):
    FULLTIME = "FULLTIME"
    PARTTIME = "PARTTIME"
    INTERNSHIP = "INTERNSHIP"
    CONTRACT = "CONTRACT"
    RESEARCH = "RESEARCH"

class SignupRequest(BaseModel):
    email: str
    password: str
    fullName: str

class SigninRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/signup")
async def signup(data: SignupRequest):
    if data.email in users:
        return JSONResponse(status_code=400, content={"detail": "User already exists"})
    users[data.email] = data.password
    return {"accessToken": "mock-token-123"}

@app.post("/api/auth/signin")
async def signin(data: SigninRequest):
    if users.get(data.email) != data.password:
        return JSONResponse(status_code=401, content={"detail": "Invalid credentials"})
    return {"accessToken": "mock-token-123"}

@app.get("/api/projects/{project_id}")
async def get_project(project_id: int):
    return {
        "id": project_id,
        "title": "Mock Project",
        "description": "A mock project for testing.",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z",
        "projectType": "FREELANCE",
        "teamSize": "FourSix"
    }

@app.get("/api/projects/{project_id}/roles")
async def get_project_roles(project_id: int):
    return [
        {"id": 1, "roleName": "Developer", "expertiseLevel": "MID", "technologies": ["Python", "FastAPI"]},
        {"id": 2, "roleName": "Designer", "expertiseLevel": "JUNIOR", "technologies": ["Figma"]}
    ]

@app.get("/api/profile/all")
async def get_all_profiles():
    return [
        {
            "id": 1,
            "email": "test1@example.com",
            "fullName": "Test Developer",
            "telegram": "test1",
            "github": "test1",
            "bio": "Test developer",
            "position": "Developer",
            "education": "BACHELOR",
            "expertise": "Python",
            "resume": "Test resume",
            "profilePicture": None,
            "technologies": ["Python", "FastAPI"],
            "expertise_level": "MID",
            "experience_years": "ONE_TO_THREE",
            "work_experience": [
                {
                    "startDate": "2022-01-01",
                    "endDate": "2023-01-01",
                    "position": "Developer",
                    "company": "MockCorp",
                    "description": "Worked on mock projects."
                }
            ]
        },
        {
            "id": 2,
            "email": "test2@example.com",
            "fullName": "Test Designer",
            "telegram": "test2",
            "github": "test2",
            "bio": "Test designer",
            "position": "Designer",
            "education": "BACHELOR",
            "expertise": "UI/UX",
            "resume": "Test resume",
            "profilePicture": None,
            "technologies": ["Figma"],
            "expertise_level": "JUNIOR",
            "experience_years": "ZERO_TO_ONE",
            "work_experience": [
                {
                    "startDate": "2023-01-01",
                    "endDate": "2024-01-01",
                    "position": "Designer",
                    "company": "MockDesign",
                    "description": "Designed mock interfaces."
                }
            ]
        },
        {
            "id": 3,
            "email": "ml@example.com",
            "fullName": "ML Engineer",
            "telegram": "ml_engineer",
            "github": "ml_engineer",
            "bio": "Senior developer with ML expertise",
            "position": "ML Engineer",
            "education": "MASTER",
            "expertise": "Machine Learning",
            "resume": "Senior ML engineer resume",
            "profilePicture": None,
            "technologies": ["Python", "TensorFlow", "PyTorch"],
            "expertise_level": "SENIOR",
            "experience_years": "FIVE_TO_SEVEN",
            "work_experience": [
                {
                    "startDate": "2019-01-01",
                    "endDate": "2024-01-01",
                    "position": "ML Engineer",
                    "company": "TechCorp",
                    "description": "Built ML models for production."
                }
            ]
        },
        {
            "id": 4,
            "email": "frontend@example.com",
            "fullName": "Frontend Developer",
            "telegram": "frontend_dev",
            "github": "frontend_dev",
            "bio": "Frontend specialist",
            "position": "Frontend Developer",
            "education": "BACHELOR",
            "expertise": "React",
            "resume": "Frontend developer resume",
            "profilePicture": None,
            "technologies": ["React", "TypeScript", "Next.js"],
            "expertise_level": "MID",
            "experience_years": "THREE_TO_FIVE",
            "work_experience": [
                {
                    "startDate": "2020-01-01",
                    "endDate": "2024-01-01",
                    "position": "Frontend Developer",
                    "company": "WebCorp",
                    "description": "Built responsive web applications."
                }
            ]
        },
        {
            "id": 5,
            "email": "devops@example.com",
            "fullName": "DevOps Engineer",
            "telegram": "devops_engineer",
            "github": "devops_engineer",
            "bio": "DevOps engineer",
            "position": "DevOps Engineer",
            "education": "BACHELOR",
            "expertise": "Infrastructure",
            "resume": "DevOps engineer resume",
            "profilePicture": None,
            "technologies": ["Docker", "Kubernetes", "AWS"],
            "expertise_level": "SENIOR",
            "experience_years": "SEVEN_TO_TEN",
            "work_experience": [
                {
                    "startDate": "2018-01-01",
                    "endDate": "2024-01-01",
                    "position": "DevOps Engineer",
                    "company": "CloudCorp",
                    "description": "Managed cloud infrastructure."
                }
            ]
        }
    ]

# Keep the old endpoint for backward compatibility
@app.get("/api/users/profiles")
async def get_user_profiles():
    return await get_all_profiles()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 
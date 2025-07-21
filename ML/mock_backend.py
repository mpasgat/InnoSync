from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Mock Backend API", version="1.0")

# In-memory user store for auth
users = {}

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
        "projectType": "Software",
        "teamSize": 3
    }

@app.get("/api/projects/{project_id}/roles")
async def get_project_roles(project_id: int):
    return [
        {"id": 1, "roleName": "Developer", "expertiseLevel": "Mid", "technologies": ["Python", "FastAPI"]},
        {"id": 2, "roleName": "Designer", "expertiseLevel": "Junior", "technologies": ["Figma"]}
    ]

@app.get("/api/users/profiles")
async def get_user_profiles():
    return [
        {
            "id": 1,
            "profile": {
                "bio": "Test developer",
                "position": "Developer",
                "education": "Computer Science",
                "expertise": "Python",
                "resume": "Test resume",
                "technologies": [{"name": "Python"}, {"name": "FastAPI"}],
                "expertiseLevel": "Mid",
                "experienceYears": "2 years",
                "workExperiences": [
                    {
                        "startDate": "2022-01-01",
                        "endDate": "2023-01-01",
                        "position": "Developer",
                        "company": "MockCorp",
                        "description": "Worked on mock projects."
                    }
                ]
            }
        },
        {
            "id": 2,
            "profile": {
                "bio": "Test designer",
                "position": "Designer",
                "education": "Design School",
                "expertise": "UI/UX",
                "resume": "Test resume",
                "technologies": [{"name": "Figma"}],
                "expertiseLevel": "Junior",
                "experienceYears": "1 years",
                "workExperiences": [
                    {
                        "startDate": "2023-01-01",
                        "endDate": "2024-01-01",
                        "position": "Designer",
                        "company": "MockDesign",
                        "description": "Designed mock interfaces."
                    }
                ]
            }
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 
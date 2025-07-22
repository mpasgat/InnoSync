from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import Optional, List
import numpy as np
import httpx
import os
from datetime import datetime, timedelta
import asyncio

from recommender import TeamRecommender
from data_types import Project, Role, Member, Work
from hybrid_selector import hybrid_team_selection

app = FastAPI(
    title="Team Recommendation API",
    description="Recommends teams with synergy scoring",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080")

# Authentication credentials
ML_USERNAME = os.getenv("ML_USERNAME", "ml-api-user")
ML_EMAIL = os.getenv("ML_EMAIL", "ml-api@innosync.com")
ML_PASSWORD = os.getenv("ML_PASSWORD", "ml-api-password")

# Global variables to store data
candidates = []
recommender = None
current_token = None
token_expiry = None

class ProjectRequest(BaseModel):
    project_id: int

class SynergyResponse(BaseModel):
    avg_synergy: float
    shared_skills: float
    experience_variance: float

class TeamResponse(BaseModel):
    project_id: str
    team_score: float
    synergy_score: float
    combined_score: float
    members: List[dict]
    synergy_metrics: SynergyResponse

async def get_current_token():
    """Get current valid token or authenticate to get a new one"""
    global current_token, token_expiry
    
    # Check if we have a valid token
    if current_token and token_expiry and datetime.utcnow() < token_expiry:
        return current_token
    
    # Authenticate to get a new token
    try:
        async with httpx.AsyncClient() as client:
            # Try to signup first (in case user doesn't exist)
            signup_data = {
                "email": ML_EMAIL,
                "password": ML_PASSWORD,
                "fullName": ML_USERNAME
            }
            
            try:
                response = await client.post(f"{BACKEND_URL}/api/auth/signup", json=signup_data)
                # If signup fails, try login
                if response.status_code != 200:
                    login_data = {
                        "email": ML_EMAIL,
                        "password": ML_PASSWORD
                    }
                    response = await client.post(f"{BACKEND_URL}/api/auth/signin", json=login_data)
                    response.raise_for_status()
            except:
                # If both fail, try login
                login_data = {
                    "email": ML_EMAIL,
                    "password": ML_PASSWORD
                }
                response = await client.post(f"{BACKEND_URL}/api/auth/signin", json=login_data)
                response.raise_for_status()
            
            auth_data = response.json()
            current_token = auth_data.get("accessToken")
            if current_token:
                # Set token expiry (assuming 24 hours if not specified)
                token_expiry = datetime.utcnow() + timedelta(hours=24)
                return current_token
            else:
                raise HTTPException(status_code=401, detail="Failed to get authentication token")
                
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Authentication failed: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

async def startup_event():
    """Startup event to authenticate with backend"""
    print("🚀 Starting ML API...")
    print(f"📡 Backend URL: {BACKEND_URL}")
    print(f"👤 ML Email: {ML_EMAIL}")
    
    try:
        # Try to authenticate on startup
        token = await get_current_token()
        if token:
            print("✅ Successfully authenticated with backend")
            print(f"🔑 Token obtained: {token[:20]}...")
        else:
            print("❌ Failed to authenticate with backend")
    except Exception as e:
        print(f"⚠️  Authentication failed on startup: {e}")
        print("🔄 Will retry authentication on first request")

@app.on_event("startup")
async def startup():
    """Startup event handler"""
    await startup_event()

async def fetch_project_details(project_id: int) -> dict:
    """Fetch project details from backend"""
    try:
        token = await get_current_token()
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {token}"}
            response = await client.get(f"{BACKEND_URL}/api/projects/{project_id}", headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch project: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching project: {str(e)}")

async def fetch_project_roles(project_id: int) -> List[dict]:
    """Fetch project roles from backend"""
    try:
        token = await get_current_token()
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {token}"}
            response = await client.get(f"{BACKEND_URL}/api/projects/{project_id}/roles", headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch project roles: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching project roles: {str(e)}")

async def fetch_all_candidates() -> List[dict]:
    """Fetch all candidates from backend"""
    try:
        token = await get_current_token()
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {token}"}
            response = await client.get(f"{BACKEND_URL}/api/profile/all", headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch candidates: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching candidates: {str(e)}")

def convert_backend_user_to_member(user_data: dict) -> Member:
    """Convert backend user data to Member object"""
    # Extract profile data
    profile = user_data.get('profile', {})
    
    # Convert work experience data
    work_experience = []
    for work_data in profile.get('workExperiences', []):
        work_experience.append(Work(
            startDate=work_data.get('startDate', ''),
            endDate=work_data.get('endDate', ''),
            position=work_data.get('position', ''),
            company=work_data.get('company', ''),
            description=work_data.get('description', '')
        ))
    
    # Extract technologies from profile
    technologies = [tech.get('name', '') for tech in profile.get('technologies', [])]
    
    # Create Member object
    return Member(
        id=user_data.get('id', 0),
        bio=profile.get('bio', ''),
        position=profile.get('position', ''),
        education=profile.get('education', ''),
        expertise=profile.get('expertise', ''),
        resume=profile.get('resume', ''),
        technologies=technologies,
        expertise_level=profile.get('expertiseLevel', ''),
        experience_years=profile.get('experienceYears', '0 years'),
        work_experience=work_experience
    )

def convert_backend_project_to_project(project_data: dict) -> Project:
    """Convert backend project data to Project object"""
    return Project(
        id=project_data.get('id', 0),
        title=project_data.get('title', ''),
        description=project_data.get('description', ''),
        createdAt=project_data.get('createdAt', ''),
        updatedAt=project_data.get('updatedAt', ''),
        projectType=project_data.get('projectType', ''),
        teamSize=project_data.get('teamSize', 1)
    )

def convert_backend_role_to_role(role_data: dict) -> Role:
    """Convert backend role data to Role object"""
    return Role(
        id=role_data.get('id', 0),
        roleName=role_data.get('roleName', ''),
        expertiseLevel=role_data.get('expertiseLevel', ''),
        technologies=role_data.get('technologies', [])
    )

@app.post("/recommend-team", response_model=dict)
async def get_team_with_synergy(request: ProjectRequest):
    """Get team recommendation for a project using project_id"""
    global candidates, recommender
    
    project_id = request.project_id
    
    try:
        # Fetch project details from backend
        project_data = await fetch_project_details(project_id)
        project = convert_backend_project_to_project(project_data)
        
        # Fetch project roles from backend
        roles_data = await fetch_project_roles(project_id)
        roles = [convert_backend_role_to_role(role_data) for role_data in roles_data]
        
        # Fetch all candidates from backend
        candidates_data = await fetch_all_candidates()
        
        # Convert candidates to Member objects
        candidates = [convert_backend_user_to_member(candidate_data) for candidate_data in candidates_data]
        
        # Initialize recommender with fresh data
        recommender = TeamRecommender(candidates)
        
        # Use hybrid ML approach
        best_team_members, ml_score = hybrid_team_selection(
            candidates, project, roles, recommender, 
            model_path="team_quality_model.joblib", n_teams=10
        )
        
        # Convert team members to the expected format for synergy calculation
        team_data = [{'member': member, 'role': 'Unknown', 'role_match_score': 0.0} 
                   for member in best_team_members]
        
        # Calculate synergy metrics for the selected team
        synergy = recommender._calculate_team_synergy(best_team_members)
        exp_variance = recommender._calculate_experience_variance(best_team_members)
        synergy['experience_variance'] = exp_variance
        
        # Calculate combined score (ML score + synergy)
        combined_score = 0.7 * ml_score + 0.3 * synergy['avg_synergy']
        
        # Convert team members to response format
        team_members = []
        for member in best_team_members:
            team_members.append({
                "id": member.id,
                "bio": member.bio,
                "position": member.position,
                "education": member.education,
                "expertise": member.expertise,
                "resume": member.resume,
                "technologies": member.technologies,
                "expertise_level": member.expertise_level,
                "experience_years": member.experience_years,
                "work_experience": [work.dict() for work in member.work_experience],
                "role_match_score": 0.0
            })
        
        return {
            "project_id": str(project_id),
            "team_score": round(ml_score, 2),
            "synergy_score": round(synergy['avg_synergy'], 2),
            "combined_score": round(combined_score, 2),
            "members": team_members,
            "synergy_metrics": {
                "avg_synergy": synergy['avg_synergy'],
                "shared_skills": synergy['shared_skills'],
                "experience_variance": synergy.get('experience_variance', 0)
            },
            "recommendation_notes": ["Selected using hybrid ML approach"],
            "method": "hybrid"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "candidates_loaded": len(candidates) if candidates else 0}

@app.get("/auth/status")
async def auth_status():
    """Check authentication status"""
    global current_token, token_expiry
    
    if current_token and token_expiry:
        is_valid = datetime.utcnow() < token_expiry
        return {
            "authenticated": is_valid,
            "token_expires": token_expiry.isoformat() if token_expiry else None,
            "backend_url": BACKEND_URL
        }
    else:
        return {
            "authenticated": False,
            "token_expires": None,
            "backend_url": BACKEND_URL
        }

# Keep the old endpoint for backward compatibility
# @app.post("/load-candidates")
# async def load_candidates(candidates_data: List[dict]):
    # """Load candidate data into the recommender (legacy endpoint)"""
    # global candidates, recommender
    # 
    # try:
        # candidates = []
        # for candidate_data in candidates_data:
            # Convert work experience data
            # work_experience = []
            # for work_data in candidate_data.get('work_experience', []):
                # work_experience.append(Work(**work_data))
            # 
            # Create Member object
            # member = Member(
                # id=candidate_data['id'],
                # bio=candidate_data.get('bio', ''),
                # position=candidate_data.get('position', ''),
                # education=candidate_data.get('education', ''),
                # expertise=candidate_data.get('expertise', ''),
                # resume=candidate_data.get('resume', ''),
                # technologies=candidate_data.get('technologies', []),
                # expertise_level=candidate_data.get('expertise_level', ''),
                # experience_years=candidate_data.get('experience_years', '0 years'),
                # work_experience=work_experience
            # )
            # candidates.append(member)
        # 
        # Initialize recommender
        # recommender = TeamRecommender(candidates)
        # 
        # return {"status": "success", "candidates_loaded": len(candidates)}
    # except Exception as e:
        # raise HTTPException(status_code=400, detail=str(e))
# 
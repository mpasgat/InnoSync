from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import Optional, List
import numpy as np
import httpx
import os

from recommender import TeamRecommender
from data_types import Project, Role, Member, Work

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
API_TOKEN = os.getenv("API_TOKEN", "")

# Global variables to store data
candidates = []
recommender = None

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

async def fetch_project_details(project_id: int) -> dict:
    """Fetch project details from backend"""
    try:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {API_TOKEN}"} if API_TOKEN else {}
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
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {API_TOKEN}"} if API_TOKEN else {}
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
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {API_TOKEN}"} if API_TOKEN else {}
            response = await client.get(f"{BACKEND_URL}/api/users/profiles", headers=headers)
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
        
        # Get recommendation
        recommendation = recommender.recommend_team_with_synergy(
            project=project,
            roles=roles,
            n_candidates=5
        )
        
        if not recommendation['team']:
            raise HTTPException(status_code=404, detail="No suitable candidates found")

        # Convert team members to response format
        team_members = []
        for member_data in recommendation['team']:
            member = member_data['member']
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
                "role_match_score": member_data.get('role_match_score', 0)
            })

        return {
            "project_id": str(project_id),
            "team_score": round(recommendation['team_score'], 2),
            "synergy_score": round(recommendation['synergy_metrics']['avg_synergy'], 2),
            "combined_score": round(recommendation['updated_team_score'], 2),
            "members": team_members,
            "synergy_metrics": {
                "avg_synergy": recommendation['synergy_metrics']['avg_synergy'],
                "shared_skills": recommendation['synergy_metrics']['shared_skills'],
                "experience_variance": recommendation['synergy_metrics'].get('experience_variance', 0)
            },
            "recommendation_notes": recommendation.get('recommendation_notes', [])
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "candidates_loaded": len(candidates) if candidates else 0}

# Keep the old endpoint for backward compatibility
@app.post("/load-candidates")
async def load_candidates(candidates_data: List[dict]):
    """Load candidate data into the recommender (legacy endpoint)"""
    global candidates, recommender
    
    try:
        candidates = []
        for candidate_data in candidates_data:
            # Convert work experience data
            work_experience = []
            for work_data in candidate_data.get('work_experience', []):
                work_experience.append(Work(**work_data))
            
            # Create Member object
            member = Member(
                id=candidate_data['id'],
                bio=candidate_data.get('bio', ''),
                position=candidate_data.get('position', ''),
                education=candidate_data.get('education', ''),
                expertise=candidate_data.get('expertise', ''),
                resume=candidate_data.get('resume', ''),
                technologies=candidate_data.get('technologies', []),
                expertise_level=candidate_data.get('expertise_level', ''),
                experience_years=candidate_data.get('experience_years', '0 years'),
                work_experience=work_experience
            )
            candidates.append(member)
        
        # Initialize recommender
        recommender = TeamRecommender(candidates)
        
        return {"status": "success", "candidates_loaded": len(candidates)}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error loading candidates: {str(e)}")

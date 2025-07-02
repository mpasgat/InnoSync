from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import Optional
import numpy as np

from recommender import TeamRecommender

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

candidates_df = pd.read_csv('team_candidates.csv')
jobs_df = pd.read_csv('team_jobs.csv')
recommender = TeamRecommender(candidates_df, jobs_df)

class ProjectRequest(BaseModel):
    id: int

class Project(BaseModel):
    id: int
    title: str
    description: str
    createdAt: str
    updatedAt: str
    projectType: str
    teamSize: int

class Role(BaseModel):
    id: int
    roleName: str
    expertiseLevel: str
    technologies: list[str]

class Work(BaseModel):
    startDate: str
    endDate: str
    position: str
    company: str
    description: str

class Member(BaseModel):
    id: int
    email: str
    fullName: str
    telegram: str
    github: str
    bio: str
    position: str
    education: str
    expertise: str
    resume: str
    profilePicture: str
    technologies: list[str]
    expertise_level: str
    experience_years: str
    work_experience: list[Work]

    # position: str
    # skills: list[str]
    # experience: int
    # current_company: str
    # match_score: float

class SynergyResponse(BaseModel):
    avg_synergy: float
    shared_skills: float
    experience_variance: float

# class TeamResponse(BaseModel):
#     project_id: str
#     team_score: float
#     synergy_score: float
#     combined_score: float
#     members: list[Member]
#     synergy_metrics: SynergyResponse

@app.post("/recommend-team", response_model=list[Member])
async def get_team_with_synergy(request: ProjectRequest):
    project_id = request.id
    
    try:
        # response = request.get(f"https://localhost:8080/api/projects/{project_id}")

        # change according to Pydantic model
    
        recommendation = recommender.recommend_team_with_synergy(
            job_id=request.job_id or jobs_df.sample(1)['job_id'].values[0],
            n_candidates=request.max_candidates or 5
        )
        
        if not recommendation['team']:
            raise HTTPException(status_code=404, detail="No candidates found")

        return {
            "job_id": recommendation['job_details']['job_id'],
            "team_score": round(recommendation['team_score'], 2),
            "synergy_score": round(recommendation['synergy_metrics']['avg_synergy'], 2),
            "combined_score": round(recommendation['updated_team_score'], 2),
            "members": [{
                "candidate_id": m['candidate_id'],
                "name": m['name'],
                "role": m['role'],
                "skills": m['skills'].split(','),
                "experience": m['experience'],
                "current_company": m['current_company'],
                "match_score": round(m.get('role_match_score', 0), 2)
            } for m in recommendation['team']],
            "synergy_metrics": {
                "avg_synergy": recommendation['synergy_metrics']['avg_synergy'],
                "shared_skills": recommendation['synergy_metrics']['shared_skills'],
                "experience_variance": np.std([m['experience'] for m in recommendation['team']])
            },
            "project_name": recommendation['job_details']['project_name'],
            "required_skills": recommendation['job_details']['required_skills'].split(','),
            "notes": recommendation['recommendation_notes']
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/jobs")
async def list_jobs():
    """List available job postings"""
    return jobs_df[['job_id', 'project_name', 'team_composition']].to_dict(orient='records')

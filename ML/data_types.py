from pydantic import BaseModel
from typing import List

class ProjectRequest(BaseModel):
    """Request model for team recommendation using project_id."""
    project_id: int

class Project(BaseModel):
    """Project representation with all necessary details."""
    id: int
    title: str
    description: str
    createdAt: str
    updatedAt: str
    projectType: str
    teamSize: int

class Role(BaseModel):
    """Role representation within a project."""
    id: int
    roleName: str
    expertiseLevel: str
    technologies: List[str]

class Work(BaseModel):
    """Work experience entry for a candidate."""
    startDate: str
    endDate: str
    position: str
    company: str
    description: str

class Member(BaseModel):
    """Candidate/member representation with all profile details."""
    id: int
    bio: str
    position: str
    education: str
    expertise: str
    resume: str
    technologies: List[str]
    expertise_level: str
    experience_years: str
    work_experience: List[Work]

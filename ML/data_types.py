from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class ProjectType(str, Enum):
    FREELANCE = "FREELANCE"
    RESEARCH = "RESEARCH"
    ACADEMIC = "ACADEMIC"
    HACKATHON = "HACKATHON"

class TeamSize(str, Enum):
    OneThree = "OneThree"
    FourSix = "FourSix"
    SevenPlus = "SevenPlus"

class Commitment(str, Enum):
    FULLTIME = "FULLTIME"
    PARTTIME = "PARTTIME"
    INTERNSHIP = "INTERNSHIP"
    CONTRACT = "CONTRACT"
    RESEARCH = "RESEARCH"

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
    projectType: ProjectType
    teamSize: TeamSize

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
    education: Optional[Education] = None
    expertise: str
    technologies: List[str]
    expertise_level: Optional[ExpertiseLevel] = None
    experience_years: Optional[ExperienceYears] = None
    work_experience: List[Work]

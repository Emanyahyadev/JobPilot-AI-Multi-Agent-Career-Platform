from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class ResumeSection(BaseModel):
    id: str
    title: str
    visible: bool = True
    order: int = 0
    content: Any

class ResumeDocumentSchema(BaseModel):
    header: Dict[str, Any]
    professional_summary: Optional[str] = None
    experience: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    skills: List[str] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[Any] = []
    achievements: List[Dict[str, Any]] = []
    publications: List[Dict[str, Any]] = []
    links: List[Dict[str, Any]] = []
    sections_order: List[str] = []
    template: str
    target_role: Optional[str] = None
    source_profile_version: Optional[str] = None

class ResumeCreate(BaseModel):
    template: str
    target_role: Optional[str] = None
    title: str

class ResumeGenerate(BaseModel):
    target_role: Optional[str] = None
    template: Optional[str] = None

class ResumeUpdate(BaseModel):
    content_snapshot: ResumeDocumentSchema

class ResumeExportRequest(BaseModel):
    version_id: int
    format: str  # pdf or docx

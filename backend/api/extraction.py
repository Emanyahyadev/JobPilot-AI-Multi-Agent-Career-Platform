from fastapi import APIRouter
from ..ai_agents.profile_agent import ProfileAgent

router = APIRouter(prefix="/extract", tags=["extraction"])
agent = ProfileAgent()

@router.post("/text")
def extract_text(payload: dict):
    text = payload.get("text", "")
    result = agent.extract_from_text(text)
    return result

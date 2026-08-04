from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.ai_recommendation import AIRecommendationEngine
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/recommendations",
    tags=["AI Recommendation Engine"]
)


class RecommendationRequest(BaseModel):
    risk_profile: str = "Moderate" # Low, Moderate, High, Aggressive
    investment_goal: str = "ESG Growth"
    monthly_investment: float = 500.0
    investment_period: int = 5


@router.post("/generate")
def generate_ai_recommendation(
    req: RecommendationRequest,
    current_user=Depends(get_current_user)
):
    result = AIRecommendationEngine.generate_recommendation(
        risk_profile=req.risk_profile,
        investment_goal=req.investment_goal,
        monthly_investment=req.monthly_investment,
        investment_period=req.investment_period,
    )
    result["user_email"] = current_user.email
    return result

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.ai_recommendation import AIRecommendationEngine
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/funds",
    tags=["Funds & Comparison"]
)


class CompareRequest(BaseModel):
    symbols: list[str] = ["ECO-SOLAR", "ECO-WIND", "CARBON-YIELD"]


@router.get("/")
def list_funds(current_user=Depends(get_current_user)):
    return AIRecommendationEngine.AVAILABLE_FUNDS


@router.post("/compare")
def compare_funds(
    req: CompareRequest,
    current_user=Depends(get_current_user)
):
    selected = [
        f for f in AIRecommendationEngine.AVAILABLE_FUNDS
        if f["symbol"] in req.symbols or not req.symbols
    ]
    
    metrics_summary = {
        "highest_cagr": max(selected, key=lambda x: x["cagr_3yr"])["symbol"] if selected else "",
        "highest_sharpe": max(selected, key=lambda x: x["sharpe_ratio"])["symbol"] if selected else "",
        "lowest_expense": min(selected, key=lambda x: x["expense_ratio"])["symbol"] if selected else "",
        "lowest_volatility": min(selected, key=lambda x: x["volatility"])["symbol"] if selected else "",
    }

    return {
        "funds": selected,
        "metrics_summary": metrics_summary,
        "total_compared": len(selected)
    }

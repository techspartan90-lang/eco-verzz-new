from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Prediction completed successfully"
    data: Optional[Any] = None


class PredictResponse(BaseModel):
    category: str = Field(..., example="Plastic")
    confidence: float = Field(..., example=0.97)
    eco_points: int = Field(..., example=25)
    recycling: str = Field(..., example="Recycle at Plastic Collection Center")
    impact: str = Field(..., example="Reduces landfill waste")
    processing_time: str = Field(..., example="0.28 sec")
    annotated_image: Optional[str] = None
    model_name: Optional[str] = "EcoVerzz-YOLOv8-Vision"


class PredictionHistoryItem(BaseModel):
    id: UUID
    report_id: Optional[UUID]
    user_id: UUID
    predicted_category: str
    confidence: float
    eco_points: int
    recycling_method: Optional[str]
    environmental_impact: Optional[str]
    image_path: str
    annotated_image: Optional[str]
    processing_time: str
    model_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class ModelInfoResponse(BaseModel):
    current_model: str
    device: str
    status: str
    supported_backends: List[str]
    categories_supported: int


# =========================================================================
# Investor Profile Schemas
# =========================================================================

class InvestorProfileCreate(BaseModel):
    age: int = 30
    annual_income: float = 1200000.0
    investment_experience: str = "Intermediate"
    risk_tolerance: str = "Moderate"
    investment_goal: str = "ESG Wealth Accumulation"
    monthly_investment: float = 25000.0
    investment_horizon: int = 5
    liquidity_requirement: str = "Medium"
    preferred_categories: str = "Equity ESG, Clean Tech"
    tax_bracket: str = "30%"


class InvestorProfileUpdate(BaseModel):
    age: Optional[int] = None
    annual_income: Optional[float] = None
    investment_experience: Optional[str] = None
    risk_tolerance: Optional[str] = None
    investment_goal: Optional[str] = None
    monthly_investment: Optional[float] = None
    investment_horizon: Optional[int] = None
    liquidity_requirement: Optional[str] = None
    preferred_categories: Optional[str] = None
    tax_bracket: Optional[str] = None


class InvestorProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    age: int
    annual_income: float
    investment_experience: str
    risk_tolerance: str
    investment_goal: str
    monthly_investment: float
    investment_horizon: int
    liquidity_requirement: str
    preferred_categories: str
    tax_bracket: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =========================================================================
# Recommendation Schemas
# =========================================================================

class RecommendationGenerateRequest(BaseModel):
    portfolio_id: Optional[UUID] = None


class RecommendationResponse(BaseModel):
    id: UUID
    user_id: UUID
    portfolio_id: Optional[UUID] = None
    recommendation_type: str
    confidence_score: float
    expected_return: float
    expected_risk: float
    recommendation_json: Optional[str] = None
    explanation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

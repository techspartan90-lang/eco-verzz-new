from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[Any] = None


class WasteReportCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: Optional[str] = None
    category: str = Field(default="Plastic & E-Waste")
    latitude: float = Field(default=0.0)
    longitude: float = Field(default=0.0)
    address: Optional[str] = None
    district: Optional[str] = "Central Urban"
    state: Optional[str] = "Eco State"
    country: Optional[str] = "India"


class WasteReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=150)
    description: Optional[str] = None
    category: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None


class AIClassificationResponse(BaseModel):
    category: str
    confidence: float
    eco_points: int


class WasteReportResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    category: str
    latitude: float
    longitude: float
    address: Optional[str]
    district: Optional[str]
    state: Optional[str]
    country: Optional[str]
    photo_url: Optional[str]
    status: str
    eco_points: int
    confidence_score: float
    ai_prediction: Optional[str]
    admin_remarks: Optional[str]
    created_at: datetime
    updated_at: datetime
    verified_at: Optional[datetime]

    class Config:
        from_attributes = True


class WasteStatistics(BaseModel):
    total_reports: int = 18
    pending: int = 4
    verified: int = 9
    resolved: int = 5
    eco_points: int = 720


class CategoryResponse(BaseModel):
    category: str
    description: str
    base_eco_points: int

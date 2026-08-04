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

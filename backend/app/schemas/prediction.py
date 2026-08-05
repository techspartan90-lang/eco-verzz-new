from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class TrainModelPayload(BaseModel):
    model_name: str = Field(default="WasteForecastRandomForest", example="WasteForecastRandomForest")
    epochs: Optional[int] = Field(default=50)


class PredictPayload(BaseModel):
    district: str = Field(default="District 1 - Central Urban")
    temperature_c: float = Field(default=28.5)
    humidity_pct: float = Field(default=65.0)


class PredictionResponse(BaseModel):
    id: UUID
    model_name: str
    prediction_result_json: str
    confidence_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class ModelStatusResponse(BaseModel):
    model_name: str
    status: str
    r2_score: float
    n_samples: int

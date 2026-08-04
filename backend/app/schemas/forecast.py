from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID


class ForecastResponse(BaseModel):
    forecast_type: str
    days: int
    data: List[Dict[str, Any]]


class DistrictForecastResponse(BaseModel):
    district_id: str
    district_name: str
    predicted_waste_kg_30_days: float
    avg_predicted_aqi: float
    risk_level: str

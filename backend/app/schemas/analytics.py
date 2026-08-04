from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class OverviewResponse(BaseModel):
    total_waste_kg: float
    total_carbon_offset_tco2e: float
    active_citizens_count: int
    eco_points_distributed: int
    recycling_rate_pct: float


class TrendsResponse(BaseModel):
    waste_trend: List[Dict[str, Any]]
    aqi_trend: List[Dict[str, Any]]


class HeatmapResponse(BaseModel):
    total_points: int
    points: List[Dict[str, Any]]


class LeaderboardResponse(BaseModel):
    top_citizens: List[Dict[str, Any]]
    top_districts: List[Dict[str, Any]]

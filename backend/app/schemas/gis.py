from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class LocationResponse(BaseModel):
    latitude: float
    longitude: float
    speed_kmh: float
    recorded_at: datetime


class VehicleResponse(BaseModel):
    id: UUID
    vehicle_code: str
    driver_name: str
    status: str
    current_latitude: float
    current_longitude: float
    speed_kmh: float
    fuel_pct: float
    created_at: datetime

    class Config:
        from_attributes = True


class HeatmapPoint(BaseModel):
    latitude: float
    longitude: float
    intensity: float


class HeatmapResponse(BaseModel):
    total_points: int
    points: List[HeatmapPoint]


class EnvironmentResponse(BaseModel):
    air_quality_aqi: float
    water_quality_ph: float
    temperature_c: float
    humidity_pct: float
    gas_leak_ppm: float
    fill_level_pct: float
    recorded_at: datetime


class RouteRequest(BaseModel):
    start_latitude: float = Field(default=12.9716)
    start_longitude: float = Field(default=77.5946)
    pickup_points: Optional[List[Dict[str, Any]]] = Field(default_factory=list)


class RouteResponse(BaseModel):
    total_stops: int
    total_distance_km: float
    estimated_time_minutes: int
    optimized_route: List[Dict[str, Any]]


class GISDashboardResponse(BaseModel):
    live_devices: int
    active_vehicles: int
    open_reports: int
    recycling_centers: int
    avg_aqi: float
    avg_water_ph: float

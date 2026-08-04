from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class SensorCreate(BaseModel):
    device_id: UUID
    sensor_type: str = Field(..., example="AQI")  # AQI, Temperature, Humidity, pH, Gas, Fill Level
    unit: str = Field(default="AQI")


class SensorDataPayload(BaseModel):
    device_id: UUID
    air_quality_aqi: float = Field(default=42.0)
    water_quality_ph: float = Field(default=7.2)
    temperature_c: float = Field(default=28.5)
    humidity_pct: float = Field(default=65.0)
    gas_leak_ppm: float = Field(default=12.0)
    fill_level_pct: float = Field(default=45.0)


class SensorResponse(BaseModel):
    id: UUID
    device_id: UUID
    sensor_type: str
    unit: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

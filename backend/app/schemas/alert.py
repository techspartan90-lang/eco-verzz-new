from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class EmergencyAlertCreate(BaseModel):
    alert_type: str = Field(..., example="Flood")  # Flood, Fire, Pollution, Chemical Leak, Cyclone, Storm, Heatwave, Water Contamination, Illegal Dumping, Wildlife Emergency
    severity: str = Field(default="High", example="Critical")  # Low, Medium, High, Critical
    title: str = Field(..., min_length=3, max_length=150)
    description: str = Field(..., min_length=5)
    location: Optional[str] = Field(default="District 1 - Central Urban")
    latitude: float = Field(default=0.0)
    longitude: float = Field(default=0.0)
    affected_radius_km: float = Field(default=10.0)


class EmergencyAlertUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=150)
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = Field(None, example="Resolved")  # Active, Resolved


class EmergencyAlertResponse(BaseModel):
    id: UUID
    alert_type: str
    severity: str
    title: str
    description: str
    location: Optional[str]
    latitude: float
    longitude: float
    affected_radius_km: float
    status: str
    created_by: UUID
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True

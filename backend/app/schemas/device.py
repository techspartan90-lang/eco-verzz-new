from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class DeviceRegisterPayload(BaseModel):
    device_name: str = Field(..., min_length=2, max_length=150)
    device_type: str = Field(default="Smart Dustbin", example="Smart Dustbin")
    mac_address: str = Field(..., min_length=12, max_length=50)
    latitude: float = Field(default=12.9716)
    longitude: float = Field(default=77.5946)
    battery_level: int = Field(default=100, ge=0, le=100)


class DeviceUpdatePayload(BaseModel):
    device_name: Optional[str] = Field(None, min_length=2, max_length=150)
    status: Optional[str] = Field(None, example="Online")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    battery_level: Optional[int] = Field(None, ge=0, le=100)


class DeviceResponse(BaseModel):
    id: UUID
    device_name: str
    device_type: str
    mac_address: str
    latitude: float
    longitude: float
    status: str
    battery_level: int
    created_at: datetime

    class Config:
        from_attributes = True

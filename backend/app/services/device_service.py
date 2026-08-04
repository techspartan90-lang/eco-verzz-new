import uuid
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.device_repository import DeviceRepository
from app.models.device import Device


class DeviceService:
    """
    Business logic layer for IoT Device Registration & Management.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = DeviceRepository(db)

    def register_device(
        self,
        device_name: str,
        device_type: str,
        mac_address: str,
        latitude: float,
        longitude: float,
        battery_level: int,
    ) -> Device:
        return self.repository.register_device(
            device_name=device_name,
            device_type=device_type,
            mac_address=mac_address,
            latitude=latitude,
            longitude=longitude,
            battery_level=battery_level,
        )

    def get_devices(self) -> List[Device]:
        return self.repository.get_devices()

    def get_device_by_id(self, device_id: uuid.UUID) -> Device:
        device = self.repository.get_device_by_id(device_id)
        if not device:
            raise HTTPException(status_code=404, detail="IoT Device not found")
        return device

    def update_device(
        self,
        device_id: uuid.UUID,
        device_name: Optional[str] = None,
        status: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        battery_level: Optional[int] = None,
    ) -> Device:
        device = self.repository.update_device(
            device_id=device_id,
            device_name=device_name,
            status=status,
            latitude=latitude,
            longitude=longitude,
            battery_level=battery_level,
        )
        if not device:
            raise HTTPException(status_code=404, detail="IoT Device not found")
        return device

    def delete_device(self, device_id: uuid.UUID) -> None:
        deleted = self.repository.delete_device(device_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="IoT Device not found")

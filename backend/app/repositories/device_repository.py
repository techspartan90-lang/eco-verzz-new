import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.device import Device


class DeviceRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for Device entities.
    """

    def __init__(self, db: Session):
        self.db = db

    def register_device(
        self,
        device_name: str,
        device_type: str,
        mac_address: str,
        latitude: float = 12.9716,
        longitude: float = 77.5946,
        battery_level: int = 100,
    ) -> Device:
        device = Device(
            device_name=device_name,
            device_type=device_type,
            mac_address=mac_address,
            latitude=latitude,
            longitude=longitude,
            status="Online",
            battery_level=battery_level,
        )
        self.db.add(device)
        self.db.commit()
        self.db.refresh(device)
        return device

    def get_devices(self) -> List[Device]:
        return self.db.query(Device).order_by(Device.created_at.desc()).all()

    def get_device_by_id(self, device_id: uuid.UUID) -> Optional[Device]:
        return self.db.query(Device).filter(Device.id == device_id).first()

    def update_device(
        self,
        device_id: uuid.UUID,
        device_name: Optional[str] = None,
        status: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        battery_level: Optional[int] = None,
    ) -> Optional[Device]:
        device = self.get_device_by_id(device_id)
        if not device:
            return None

        if device_name is not None:
            device.device_name = device_name
        if status is not None:
            device.status = status
        if latitude is not None:
            device.latitude = latitude
        if longitude is not None:
            device.longitude = longitude
        if battery_level is not None:
            device.battery_level = battery_level

        self.db.commit()
        self.db.refresh(device)
        return device

    def delete_device(self, device_id: uuid.UUID) -> bool:
        device = self.get_device_by_id(device_id)
        if not device:
            return False
        self.db.delete(device)
        self.db.commit()
        return True

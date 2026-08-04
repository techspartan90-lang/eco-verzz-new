import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.user import User
from app.services.device_service import DeviceService
from app.schemas.device import (
    StandardResponse,
    DeviceRegisterPayload,
    DeviceUpdatePayload,
    DeviceResponse,
)

router = APIRouter(
    prefix="/iot/device",
    tags=["IoT Device Registration & Management"]
)


@router.post(
    "/register",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register IoT Sensor / Smart Bin Device",
    description="Registers a new IoT device (Smart Dustbin, GPS Tracker, Air Quality Sensor, Water Sensor, Gas Sensor, etc.) with MAC address and GPS coordinates."
)
def register_device(
    payload: DeviceRegisterPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"])),
):
    service = DeviceService(db)
    device = service.register_device(
        device_name=payload.device_name,
        device_type=payload.device_type,
        mac_address=payload.mac_address,
        latitude=payload.latitude,
        longitude=payload.longitude,
        battery_level=payload.battery_level,
    )
    return StandardResponse(
        success=True,
        message="IoT device registered successfully",
        data={
            "id": str(device.id),
            "device_name": device.device_name,
            "device_type": device.device_type,
            "mac_address": device.mac_address,
            "status": device.status,
            "created_at": device.created_at.isoformat(),
        }
    )


@router.get(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Registered IoT Devices List",
    description="Returns list of registered IoT devices, battery health, and online status."
)
@router.get(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_all_devices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DeviceService(db)
    devices = service.get_devices()
    return StandardResponse(
        success=True,
        message="IoT devices loaded successfully",
        data=[
            {
                "id": str(d.id),
                "device_name": d.device_name,
                "device_type": d.device_type,
                "mac_address": d.mac_address,
                "latitude": d.latitude,
                "longitude": d.longitude,
                "status": d.status,
                "battery_level": d.battery_level,
                "created_at": d.created_at.isoformat(),
            }
            for d in devices
        ]
    )


@router.get(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get IoT Device Details by ID",
    description="Returns details for a target IoT device by UUID."
)
def get_device_by_id(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DeviceService(db)
    d = service.get_device_by_id(id)
    return StandardResponse(
        success=True,
        message="IoT device details loaded successfully",
        data={
            "id": str(d.id),
            "device_name": d.device_name,
            "device_type": d.device_type,
            "mac_address": d.mac_address,
            "latitude": d.latitude,
            "longitude": d.longitude,
            "status": d.status,
            "battery_level": d.battery_level,
            "created_at": d.created_at.isoformat(),
        }
    )


@router.patch(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update IoT Device Status / Coordinates",
    description="Updates device name, online status, battery percentage, or GPS location."
)
def update_device(
    id: uuid.UUID,
    payload: DeviceUpdatePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"])),
):
    service = DeviceService(db)
    d = service.update_device(
        device_id=id,
        device_name=payload.device_name,
        status=payload.status,
        latitude=payload.latitude,
        longitude=payload.longitude,
        battery_level=payload.battery_level,
    )
    return StandardResponse(
        success=True,
        message="IoT device updated successfully",
        data={"id": str(d.id), "device_name": d.device_name, "status": d.status}
    )


@router.delete(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete IoT Device",
    description="Deletes an IoT device by UUID. Restricted to Admin users."
)
def delete_device(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"])),
):
    service = DeviceService(db)
    service.delete_device(id)
    return StandardResponse(
        success=True,
        message="IoT device deleted successfully",
        data={"id": str(id)}
    )

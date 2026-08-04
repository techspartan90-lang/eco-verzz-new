import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.sensor_service import SensorService
from app.schemas.sensor import (
    StandardResponse,
    SensorDataPayload,
)

router = APIRouter(
    prefix="/sensor",
    tags=["Environmental Sensors & Telemetry Ingestion"]
)


@router.post(
    "/data",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Post Real-time Telemetry Data from IoT Sensor",
    description="Ingests live sensor telemetry payload (Air Quality AQI, Water pH, Temperature °C, Humidity %, Gas PPM, Dustbin Fill Level %). Evaluates safety thresholds."
)
def post_sensor_data(
    payload: SensorDataPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = SensorService(db)
    res = service.record_sensor_telemetry(
        device_id=payload.device_id,
        air_quality_aqi=payload.air_quality_aqi,
        water_quality_ph=payload.water_quality_ph,
        temperature_c=payload.temperature_c,
        humidity_pct=payload.humidity_pct,
        gas_leak_ppm=payload.gas_leak_ppm,
        fill_level_pct=payload.fill_level_pct,
    )
    return StandardResponse(
        success=True,
        message="Sensor telemetry recorded successfully",
        data=res
    )


@router.get(
    "/live",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Live Environmental Telemetry",
    description="Returns live environmental telemetry streaming records across all active sensors."
)
def get_live_sensor_telemetry(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = SensorService(db)
    live_records = service.get_live_telemetry(limit)
    return StandardResponse(
        success=True,
        message="Live environmental telemetry loaded successfully",
        data=[
            {
                "id": str(r.id),
                "device_id": str(r.device_id),
                "air_quality_aqi": r.air_quality_aqi,
                "water_quality_ph": r.water_quality_ph,
                "temperature_c": r.temperature_c,
                "humidity_pct": r.humidity_pct,
                "gas_leak_ppm": r.gas_leak_ppm,
                "fill_level_pct": r.fill_level_pct,
                "recorded_at": r.recorded_at.isoformat(),
            }
            for r in live_records
        ]
    )


@router.get(
    "/history",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Historical Telemetry Data by Device ID",
    description="Returns historical sensor readings for a specific IoT device by UUID."
)
def get_sensor_history(
    device_id: uuid.UUID = Query(...),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = SensorService(db)
    history = service.get_sensor_history(device_id, limit)
    return StandardResponse(
        success=True,
        message="Sensor history loaded successfully",
        data=[
            {
                "id": str(r.id),
                "air_quality_aqi": r.air_quality_aqi,
                "water_quality_ph": r.water_quality_ph,
                "temperature_c": r.temperature_c,
                "humidity_pct": r.humidity_pct,
                "gas_leak_ppm": r.gas_leak_ppm,
                "fill_level_pct": r.fill_level_pct,
                "recorded_at": r.recorded_at.isoformat(),
            }
            for r in history
        ]
    )


@router.get(
    "/statistics",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Environmental Sensor Statistics",
    description="Returns average AQI, water pH, ambient temperature, humidity, gas PPM, and dustbin fill levels."
)
def get_environmental_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = SensorService(db)
    stats = service.get_statistics()
    return StandardResponse(
        success=True,
        message="Environmental statistics loaded successfully",
        data=stats
    )

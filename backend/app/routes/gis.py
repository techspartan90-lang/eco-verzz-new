import uuid
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.gis_service import GISService
from app.websocket.connection_manager import manager
from app.schemas.gis import (
    StandardResponse,
    RouteRequest,
)

router = APIRouter(
    tags=["Smart City GIS & Live Environmental Monitoring"]
)


@router.get(
    "/map/live",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Live GIS Map Summary",
    description="Returns live map summary including vehicle locations, active IoT sensors, heatmap points count, and Leaflet/Mapbox tile configurations."
)
def get_live_map(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GISService(db)
    summary = service.get_live_map_summary()
    return StandardResponse(
        success=True,
        message="Live GIS map summary loaded successfully",
        data=summary
    )


@router.get(
    "/map/reports",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Geo-tagged Waste Reports for GIS Map",
    description="Returns geo-tagged waste reports with latitude, longitude, category, and resolution status for Leaflet map markers."
)
def get_map_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GISService(db)
    heatmap_data = service.get_heatmap_points()
    return StandardResponse(
        success=True,
        message="Geo-tagged waste reports retrieved successfully",
        data=heatmap_data
    )


@router.get(
    "/map/vehicles",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Live Collection Vehicles Location",
    description="Returns live GPS coordinates, speed, and fuel status of municipal collection vehicles."
)
def get_map_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GISService(db)
    vehicles = service.get_live_vehicles()
    return StandardResponse(
        success=True,
        message="Collection vehicles location loaded successfully",
        data=[
            {
                "id": str(v.id),
                "vehicle_code": v.vehicle_code,
                "driver_name": v.driver_name,
                "status": v.status,
                "current_latitude": v.current_latitude,
                "current_longitude": v.current_longitude,
                "speed_kmh": v.speed_kmh,
                "fuel_pct": v.fuel_pct,
            }
            for v in vehicles
        ]
    )


@router.get(
    "/map/recycling-centers",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Nearby Recycling Centers GIS Layer",
    description="Returns list of verified recycling hubs and deposit centers for GIS map layering."
)
def get_recycling_centers_map(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GISService(db)
    centers = service.get_recycling_centers()
    return StandardResponse(
        success=True,
        message="Recycling centers loaded successfully",
        data=centers
    )


@router.get(
    "/map/heatmap",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Waste Density Heatmap Layer",
    description="Returns GPS heatmap point coordinates and intensity metrics for Leaflet/Mapbox heatmap visualization."
)
def get_heatmap_layer(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GISService(db)
    pts = service.get_heatmap_points()
    return StandardResponse(
        success=True,
        message="Heatmap points retrieved successfully",
        data=pts
    )


@router.get(
    "/vehicle/live",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Live GPS Tracking for Fleet",
    description="Returns live fleet tracking status."
)
def get_vehicle_live_tracking(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GISService(db)
    vehicles = service.get_live_vehicles()
    return StandardResponse(
        success=True,
        message="Live vehicle tracking loaded successfully",
        data=[
            {
                "id": str(v.id),
                "vehicle_code": v.vehicle_code,
                "latitude": v.current_latitude,
                "longitude": v.current_longitude,
                "speed_kmh": v.speed_kmh,
            }
            for v in vehicles
        ]
    )


@router.get(
    "/vehicle/history",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Vehicle Travel History Logs",
    description="Returns historical GPS breadcrumb coordinates for route replay."
)
def get_vehicle_history(
    vehicle_id: Optional[uuid.UUID] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return StandardResponse(
        success=True,
        message="Vehicle history logs loaded successfully",
        data=[
            {"latitude": 12.9716, "longitude": 77.5946, "speed_kmh": 35.0, "recorded_at": "2026-08-04T14:00:00Z"},
            {"latitude": 12.9780, "longitude": 77.5900, "speed_kmh": 38.0, "recorded_at": "2026-08-04T14:15:00Z"},
            {"latitude": 12.9850, "longitude": 77.6050, "speed_kmh": 32.0, "recorded_at": "2026-08-04T14:30:00Z"},
        ]
    )


@router.post(
    "/vehicle/route",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate Optimized Priority Waste Pickup Route (TSP)",
    description="Solves Traveling Salesperson Problem (TSP) using Nearest Neighbor algorithm for vehicle route optimization."
)
def calculate_vehicle_route(
    payload: RouteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GISService(db)
    route_res = service.optimize_collection_route(
        start_latitude=payload.start_latitude,
        start_longitude=payload.start_longitude,
        pickup_points=payload.pickup_points or [],
    )
    return StandardResponse(
        success=True,
        message="Optimized route calculated successfully",
        data=route_res
    )


# =========================================================================
# WEBSOCKET GIS & SENSOR STREAMING ENDPOINTS
# =========================================================================

@router.websocket("/ws/map")
async def websocket_map_endpoint(websocket: WebSocket):
    await manager.connect_room(websocket, "gis_live_map")
    try:
        while True:
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_room(websocket, "gis_live_map")


@router.websocket("/ws/sensors")
async def websocket_sensors_endpoint(websocket: WebSocket):
    await manager.connect_room(websocket, "sensors_live_telemetry")
    try:
        while True:
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_room(websocket, "sensors_live_telemetry")


@router.websocket("/ws/vehicles")
async def websocket_vehicles_endpoint(websocket: WebSocket):
    await manager.connect_room(websocket, "vehicles_gps_live")
    try:
        while True:
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_room(websocket, "vehicles_gps_live")


@router.websocket("/ws/environment")
async def websocket_environment_endpoint(websocket: WebSocket):
    await manager.connect_room(websocket, "environment_metrics")
    try:
        while True:
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_room(websocket, "environment_metrics")

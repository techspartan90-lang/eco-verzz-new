import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.user import User
from app.services.alert_service import AlertService
from app.schemas.alert import (
    StandardResponse,
    EmergencyAlertCreate,
    EmergencyAlertUpdate,
    EmergencyAlertResponse,
)

router = APIRouter(
    prefix="/alerts",
    tags=["Environmental Emergency Alerts"]
)


@router.post(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Environmental Emergency Alert (Admin & Official)",
    description="Creates a new environmental emergency alert (Flood, Fire, Pollution, Chemical Leak, Cyclone, Storm, Heatwave, Water Contamination, Illegal Dumping, Wildlife Emergency) and triggers multi-channel Push, SMS, and Email broadcasts."
)
@router.post(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False
)
def create_emergency_alert(
    payload: EmergencyAlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"])),
):
    service = AlertService(db)
    alert = service.create_alert(
        current_user=current_user,
        alert_type=payload.alert_type,
        severity=payload.severity,
        title=payload.title,
        description=payload.description,
        location=payload.location,
        latitude=payload.latitude,
        longitude=payload.longitude,
        affected_radius_km=payload.affected_radius_km,
    )
    return StandardResponse(
        success=True,
        message="Emergency alert created and broadcasted successfully",
        data={
            "id": str(alert.id),
            "alert_type": alert.alert_type,
            "severity": alert.severity,
            "title": alert.title,
            "description": alert.description,
            "location": alert.location,
            "status": alert.status,
            "created_at": alert.created_at.isoformat(),
        }
    )


@router.get(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Environmental Emergency Alerts List",
    description="Returns active and historical environmental emergency alerts."
)
@router.get(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_emergency_alerts(
    active_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AlertService(db)
    alerts = service.get_alerts(active_only)
    return StandardResponse(
        success=True,
        message="Emergency alerts loaded successfully",
        data=[
            {
                "id": str(a.id),
                "alert_type": a.alert_type,
                "severity": a.severity,
                "title": a.title,
                "description": a.description,
                "location": a.location,
                "latitude": a.latitude,
                "longitude": a.longitude,
                "affected_radius_km": a.affected_radius_km,
                "status": a.status,
                "created_by": str(a.created_by),
                "created_at": a.created_at.isoformat(),
                "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None,
            }
            for a in alerts
        ]
    )


@router.get(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Emergency Alert Details by ID",
    description="Returns full emergency alert details by UUID."
)
def get_emergency_alert_by_id(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AlertService(db)
    a = service.get_alert_by_id(id)
    return StandardResponse(
        success=True,
        message="Emergency alert details loaded successfully",
        data={
            "id": str(a.id),
            "alert_type": a.alert_type,
            "severity": a.severity,
            "title": a.title,
            "description": a.description,
            "location": a.location,
            "latitude": a.latitude,
            "longitude": a.longitude,
            "affected_radius_km": a.affected_radius_km,
            "status": a.status,
            "created_by": str(a.created_by),
            "created_at": a.created_at.isoformat(),
            "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None,
        }
    )


@router.patch(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update or Resolve Emergency Alert",
    description="Updates title, description, severity, or marks emergency alert as Resolved."
)
def update_emergency_alert(
    id: uuid.UUID,
    payload: EmergencyAlertUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"])),
):
    service = AlertService(db)
    a = service.update_alert(
        alert_id=id,
        title=payload.title,
        description=payload.description,
        severity=payload.severity,
        status=payload.status,
    )
    return StandardResponse(
        success=True,
        message="Emergency alert updated successfully",
        data={
            "id": str(a.id),
            "title": a.title,
            "status": a.status,
            "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None,
        }
    )


@router.delete(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete Emergency Alert",
    description="Deletes an emergency alert by UUID. Restricted to Admin users."
)
def delete_emergency_alert(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"])),
):
    service = AlertService(db)
    service.delete_alert(id)
    return StandardResponse(
        success=True,
        message="Emergency alert deleted successfully",
        data={"id": str(id)}
    )

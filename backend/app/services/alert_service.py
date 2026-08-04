import uuid
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.alert_repository import AlertRepository
from app.tasks.notification_tasks import AsyncNotificationTasks
from app.models.emergency_alert import EmergencyAlert
from app.models.user import User


class AlertService:
    """
    Business logic layer for Environmental Emergency Alerts.
    Triggers automated multi-channel alert delivery (Push, Email, SMS).
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = AlertRepository(db)

    def create_alert(
        self,
        current_user: User,
        alert_type: str,
        severity: str,
        title: str,
        description: str,
        location: Optional[str],
        latitude: float,
        longitude: float,
        affected_radius_km: float,
    ) -> EmergencyAlert:
        alert = self.repository.create_alert(
            creator_id=current_user.id,
            alert_type=alert_type,
            severity=severity,
            title=title,
            description=description,
            location=location,
            latitude=latitude,
            longitude=longitude,
            affected_radius_km=affected_radius_km,
        )

        # Trigger async multi-channel notification task (Push, Email, SMS)
        AsyncNotificationTasks.dispatch_emergency_alert_task(
            alert_title=title,
            alert_body=description,
            location=location or "Central Urban",
        )

        return alert

    def get_alerts(self, active_only: bool = False) -> List[EmergencyAlert]:
        return self.repository.get_alerts(active_only)

    def get_alert_by_id(self, alert_id: uuid.UUID) -> EmergencyAlert:
        alert = self.repository.get_alert_by_id(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Emergency alert not found")
        return alert

    def update_alert(
        self,
        alert_id: uuid.UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
    ) -> EmergencyAlert:
        alert = self.repository.update_alert(alert_id, title, description, severity, status)
        if not alert:
            raise HTTPException(status_code=404, detail="Emergency alert not found")
        return alert

    def delete_alert(self, alert_id: uuid.UUID) -> None:
        deleted = self.repository.delete_alert(alert_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Emergency alert not found")

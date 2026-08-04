import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.emergency_alert import EmergencyAlert


class AlertRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for EmergencyAlert entities.
    """

    def __init__(self, db: Session):
        self.db = db

    def create_alert(
        self,
        creator_id: uuid.UUID,
        alert_type: str,
        severity: str,
        title: str,
        description: str,
        location: Optional[str] = None,
        latitude: float = 0.0,
        longitude: float = 0.0,
        affected_radius_km: float = 10.0,
    ) -> EmergencyAlert:
        alert = EmergencyAlert(
            created_by=creator_id,
            alert_type=alert_type,
            severity=severity,
            title=title,
            description=description,
            location=location or "Central Urban",
            latitude=latitude,
            longitude=longitude,
            affected_radius_km=affected_radius_km,
            status="Active",
        )
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def get_alerts(self, active_only: bool = False) -> List[EmergencyAlert]:
        query = self.db.query(EmergencyAlert)
        if active_only:
            query = query.filter(EmergencyAlert.status == "Active")
        return query.order_by(EmergencyAlert.created_at.desc()).all()

    def get_alert_by_id(self, alert_id: uuid.UUID) -> Optional[EmergencyAlert]:
        return self.db.query(EmergencyAlert).filter(EmergencyAlert.id == alert_id).first()

    def update_alert(
        self,
        alert_id: uuid.UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
    ) -> Optional[EmergencyAlert]:
        alert = self.get_alert_by_id(alert_id)
        if not alert:
            return None

        if title is not None:
            alert.title = title
        if description is not None:
            alert.description = description
        if severity is not None:
            alert.severity = severity
        if status is not None:
            alert.status = status
            if status == "Resolved":
                alert.resolved_at = datetime.now()

        self.db.commit()
        self.db.refresh(alert)
        return alert

    def delete_alert(self, alert_id: uuid.UUID) -> bool:
        alert = self.get_alert_by_id(alert_id)
        if not alert:
            return False
        self.db.delete(alert)
        self.db.commit()
        return True

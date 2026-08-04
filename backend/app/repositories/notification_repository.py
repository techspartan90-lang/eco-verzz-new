import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User


class NotificationRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for Notification entities.
    """

    def __init__(self, db: Session):
        self.db = db

    def create_notification(
        self,
        user_email: str,
        title: str,
        message: str,
        category: str = "Alert",
        notification_type: str = "System",
        link_url: Optional[str] = None,
        user_id: Optional[uuid.UUID] = None,
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            user_email=user_email,
            title=title,
            message=message,
            category=category,
            notification_type=notification_type,
            link_url=link_url,
            is_read=False,
        )
        self.db.add(notif)
        self.db.commit()
        self.db.refresh(notif)
        return notif

    def broadcast_notification(self, title: str, message: str, category: str = "Broadcast") -> int:
        users = self.db.query(User).all()
        count = 0
        for u in users:
            notif = Notification(
                user_id=u.id,
                user_email=u.email,
                title=title,
                message=message,
                category=category,
                notification_type="Broadcast",
                is_read=False,
            )
            self.db.add(notif)
            count += 1
        self.db.commit()
        return count

    def get_notifications(self, user_email: str, limit: int = 50) -> List[Notification]:
        return self.db.query(Notification).filter(
            Notification.user_email == user_email
        ).order_by(Notification.created_at.desc()).limit(limit).all()

    def get_unread_notifications(self, user_email: str) -> List[Notification]:
        return self.db.query(Notification).filter(
            Notification.user_email == user_email,
            Notification.is_read == False
        ).order_by(Notification.created_at.desc()).all()

    def get_unread_count(self, user_email: str) -> int:
        return self.db.query(Notification).filter(
            Notification.user_email == user_email,
            Notification.is_read == False
        ).count()

    def mark_read(self, notification_id: uuid.UUID, user_email: str) -> Optional[Notification]:
        notif = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_email == user_email
        ).first()
        if notif:
            notif.is_read = True
            self.db.commit()
            self.db.refresh(notif)
        return notif

    def mark_all_read(self, user_email: str) -> int:
        notifs = self.db.query(Notification).filter(
            Notification.user_email == user_email,
            Notification.is_read == False
        ).all()
        count = len(notifs)
        for n in notifs:
            n.is_read = True
        self.db.commit()
        return count

    def delete_notification(self, notification_id: uuid.UUID, user_email: str) -> bool:
        notif = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_email == user_email
        ).first()
        if not notif:
            return False
        self.db.delete(notif)
        self.db.commit()
        return True

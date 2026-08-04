import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.repositories.notification_repository import NotificationRepository
from app.models.notification import Notification
from app.models.user import User


class NotificationService:
    """
    Business logic layer for Notifications.
    Orchestrates repository queries, unread counts, status updates, and broadcast messages.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = NotificationRepository(db)

    def get_user_notifications(self, current_user: User, limit: int = 50) -> List[Notification]:
        return self.repository.get_notifications(current_user.email, limit)

    def get_unread_notifications(self, current_user: User) -> List[Notification]:
        return self.repository.get_unread_notifications(current_user.email)

    def get_unread_count(self, current_user: User) -> int:
        return self.repository.get_unread_count(current_user.email)

    def mark_read(self, current_user: User, notification_id: uuid.UUID) -> Optional[Notification]:
        return self.repository.mark_read(notification_id, current_user.email)

    def mark_all_read(self, current_user: User) -> int:
        return self.repository.mark_all_read(current_user.email)

    def delete_notification(self, current_user: User, notification_id: uuid.UUID) -> bool:
        return self.repository.delete_notification(notification_id, current_user.email)

    def broadcast_notification(self, title: str, message: str, category: str = "Broadcast") -> int:
        return self.repository.broadcast_notification(title, message, category)

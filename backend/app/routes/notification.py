import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.user import User
from app.services.notification_service import NotificationService
from app.schemas.notification import (
    StandardResponse,
    NotificationCreate,
    NotificationResponse,
    UnreadCountResponse,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Real-Time Notifications"]
)


@router.get(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Authenticated User Notifications",
    description="Returns notifications list for the logged-in user including alert category, read state, and timestamps."
)
@router.get(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_user_notifications(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)
    notifs = service.get_user_notifications(current_user, limit)
    return StandardResponse(
        success=True,
        message="Notifications retrieved successfully",
        data=[
            {
                "id": str(n.id),
                "user_email": n.user_email,
                "title": n.title,
                "message": n.message,
                "category": n.category,
                "notification_type": getattr(n, "notification_type", "System"),
                "link_url": getattr(n, "link_url", None),
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in notifs
        ]
    )


@router.get(
    "/unread",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Unread Notification Count & List",
    description="Returns count of unread notifications and the unread notification items for the logged-in user."
)
def get_unread_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)
    unread_notifs = service.get_unread_notifications(current_user)
    count = service.get_unread_count(current_user)
    return StandardResponse(
        success=True,
        message="Unread notifications retrieved successfully",
        data={
            "unread_count": count,
            "notifications": [
                {
                    "id": str(n.id),
                    "title": n.title,
                    "message": n.message,
                    "category": n.category,
                    "is_read": n.is_read,
                    "created_at": n.created_at.isoformat(),
                }
                for n in unread_notifs
            ]
        }
    )


@router.patch(
    "/{id}/read",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark Notification as Read",
    description="Marks a single notification as read by UUID."
)
def mark_notification_read(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)
    notif = service.mark_read(current_user, id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return StandardResponse(
        success=True,
        message="Notification marked as read",
        data={"id": str(id), "is_read": True}
    )


@router.patch(
    "/read-all",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark All Notifications as Read",
    description="Marks all unread notifications as read for the authenticated user."
)
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)
    count = service.mark_all_read(current_user)
    return StandardResponse(
        success=True,
        message=f"Marked {count} notifications as read",
        data={"marked_count": count}
    )


@router.delete(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete Notification Record",
    description="Deletes a notification record by UUID."
)
def delete_notification(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)
    deleted = service.delete_notification(current_user, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Notification not found")
    return StandardResponse(
        success=True,
        message="Notification deleted successfully",
        data={"id": str(id)}
    )


@router.post(
    "/broadcast",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Broadcast System Announcement (Admin Only)",
    description="Sends system announcement to all registered users. Restricted to Admin users."
)
def broadcast_notification_admin(
    payload: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    service = NotificationService(db)
    count = service.broadcast_notification(payload.title, payload.message, payload.category)
    return StandardResponse(
        success=True,
        message="Broadcast notification sent successfully",
        data={"recipients_count": count, "title": payload.title}
    )

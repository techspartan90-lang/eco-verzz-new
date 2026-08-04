from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

# Mock in-memory notifications feed per user
MOCK_NOTIFICATIONS = [
    {
        "id": "notif-1",
        "title": "NAV Update: ECO-SOLAR +2.4%",
        "message": "EcoVerzz Global Solar Infrastructure Fund NAV updated to $142.50 (+2.4% today).",
        "category": "NAV",
        "is_read": False,
        "created_at": "10 mins ago"
    },
    {
        "id": "notif-2",
        "title": "AI Recommendation Alert",
        "message": "New AI opportunity detected: Rebalance 5% into Green Hydrogen ETF for +3.2% CAGR boost.",
        "category": "AI",
        "is_read": False,
        "created_at": "1 hour ago"
    },
    {
        "id": "notif-3",
        "title": "Carbon Credit Dividend Credited",
        "message": "3,450 ECO Carbon Credit Dividend credited to your rewards vault.",
        "category": "Investment",
        "is_read": True,
        "created_at": "Yesterday"
    },
    {
        "id": "notif-4",
        "title": "Portfolio Risk Alert: Low Volatility",
        "message": "Your portfolio volatility is 11.8%, performing safely below market risk threshold.",
        "category": "Alert",
        "is_read": True,
        "created_at": "2 days ago"
    }
]


class MarkReadRequest(BaseModel):
    notification_id: str


class EmailNotificationRequest(BaseModel):
    to_email: str
    subject: str
    body: str


@router.get("/")
def get_user_notifications(current_user=Depends(get_current_user)):
    unread_count = sum(1 for n in MOCK_NOTIFICATIONS if not n["is_read"])
    return {
        "notifications": MOCK_NOTIFICATIONS,
        "unread_count": unread_count,
        "user_email": current_user.email
    }


@router.post("/mark-read")
def mark_notification_as_read(
    req: MarkReadRequest,
    current_user=Depends(get_current_user)
):
    for n in MOCK_NOTIFICATIONS:
        if n["id"] == req.notification_id:
            n["is_read"] = True
            break
    return {"message": "Notification marked as read", "id": req.notification_id}


@router.post("/send-email")
def send_email_notification(
    req: EmailNotificationRequest,
    current_user=Depends(get_current_user)
):
    return {
        "status": "sent",
        "message": f"Email alert successfully dispatched to {req.to_email}",
        "subject": req.subject,
        "timestamp": datetime.now().isoformat()
    }

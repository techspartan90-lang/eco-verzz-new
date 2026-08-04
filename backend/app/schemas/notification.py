from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class NotificationCreate(BaseModel):
    user_email: str
    title: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=5)
    category: str = Field(default="Alert")
    notification_type: str = Field(default="System")
    link_url: Optional[str] = None


class NotificationResponse(BaseModel):
    id: UUID
    user_email: str
    title: str
    message: str
    category: str
    notification_type: str
    link_url: Optional[str]
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UnreadCountResponse(BaseModel):
    unread_count: int = 0

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class ChatRoomCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    room_type: str = Field(default="Community", example="Community")  # One-to-One, Community, Admin Broadcast
    members: Optional[List[str]] = Field(default_factory=list)


class ChatRoomResponse(BaseModel):
    id: UUID
    name: str
    room_type: str
    created_by: UUID
    members_json: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    room_id: UUID
    content: str = Field(..., min_length=1)
    message_type: str = Field(default="text")  # text, image, file
    media_url: Optional[str] = None


class MessageResponse(BaseModel):
    id: UUID
    room_id: UUID
    sender_id: UUID
    sender_name: str
    content: str
    media_url: Optional[str]
    message_type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

import uuid
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.chat_room import ChatRoom
from app.models.message import Message
from app.models.user import User


class ChatRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for ChatRoom & Message entities.
    """

    def __init__(self, db: Session):
        self.db = db

    def create_chat_room(
        self,
        creator_id: uuid.UUID,
        name: str,
        room_type: str = "Community",
        members: Optional[List[str]] = None,
    ) -> ChatRoom:
        room = ChatRoom(
            name=name,
            room_type=room_type,
            created_by=creator_id,
            members_json=json.dumps(members or []),
        )
        self.db.add(room)
        self.db.commit()
        self.db.refresh(room)
        return room

    def get_chat_rooms(self) -> List[ChatRoom]:
        return self.db.query(ChatRoom).order_by(ChatRoom.created_at.desc()).all()

    def get_room_by_id(self, room_id: uuid.UUID) -> Optional[ChatRoom]:
        return self.db.query(ChatRoom).filter(ChatRoom.id == room_id).first()

    def save_message(
        self,
        room_id: uuid.UUID,
        sender_id: uuid.UUID,
        sender_name: str,
        content: str,
        media_url: Optional[str] = None,
        message_type: str = "text",
    ) -> Message:
        msg = Message(
            room_id=room_id,
            sender_id=sender_id,
            sender_name=sender_name,
            content=content,
            media_url=media_url,
            message_type=message_type,
            is_read=False,
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg

    def get_messages(self, room_id: uuid.UUID, limit: int = 50) -> List[Message]:
        return self.db.query(Message).filter(
            Message.room_id == room_id
        ).order_by(Message.created_at.asc()).limit(limit).all()

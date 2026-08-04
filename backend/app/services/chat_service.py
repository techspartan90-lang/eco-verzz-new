import uuid
from typing import Dict, Any, List, Optional
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.chat_repository import ChatRepository
from app.utils.image_processor import ImageProcessor
from app.models.chat_room import ChatRoom
from app.models.message import Message
from app.models.user import User


class ChatService:
    """
    Business logic layer for Chat Systems & Real-Time Messaging.
    Handles room creation, message persistence, file uploads, and history queries.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = ChatRepository(db)

    def create_chat_room(self, current_user: User, name: str, room_type: str, members: Optional[List[str]]) -> ChatRoom:
        return self.repository.create_chat_room(current_user.id, name, room_type, members)

    def get_chat_rooms(self) -> List[ChatRoom]:
        rooms = self.repository.get_chat_rooms()
        if not rooms:
            # Seed initial global community chat room
            default_room = self.repository.create_chat_room(
                creator_id=uuid.uuid4(),
                name="EcoVerzz Global Community",
                room_type="Community",
                members=["all"],
            )
            rooms = [default_room]
        return rooms

    def send_message(
        self,
        current_user: User,
        room_id: uuid.UUID,
        content: str,
        media_url: Optional[str] = None,
        message_type: str = "text",
    ) -> Message:
        sender_name = current_user.full_name or current_user.email.split("@")[0].capitalize()
        return self.repository.save_message(
            room_id=room_id,
            sender_id=current_user.id,
            sender_name=sender_name,
            content=content,
            media_url=media_url,
            message_type=message_type,
        )

    def get_messages(self, room_id: uuid.UUID, limit: int = 50) -> List[Message]:
        return self.repository.get_messages(room_id, limit)

    def upload_chat_media(self, image_file: UploadFile) -> Dict[str, Any]:
        file_bytes = image_file.file.read()
        return ImageProcessor.save_and_process_image(image_file, file_bytes)

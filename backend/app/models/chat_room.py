import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class ChatRoom(Base):
    __tablename__ = "chat_rooms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    room_type: Mapped[str] = mapped_column(String(50), default="Community", nullable=False)  # One-to-One, Community, Admin Broadcast

    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    members_json: Mapped[str | None] = mapped_column(Text, default="[]", nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationships
    creator = relationship("User", backref="created_chat_rooms")
    messages = relationship("Message", back_populates="room", cascade="all, delete-orphan")

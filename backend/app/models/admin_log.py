import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class AdminLog(Base):
    __tablename__ = "admin_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    admin_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    action: Mapped[str] = mapped_column(String(100), nullable=False)  # VERIFY_REPORT, UPDATE_ROLE, BONUS_POINTS, etc.
    entity: Mapped[str] = mapped_column(String(100), nullable=False)  # User, WasteReport, AIPrediction, Badge
    entity_id: Mapped[str | None] = mapped_column(String(100), nullable=True)

    old_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    new_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), default="127.0.0.1", nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationship
    admin_user = relationship("User", backref="admin_audit_logs")

import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class WasteReport(Base):
    __tablename__ = "waste_reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(50), default="Plastic & E-Waste", nullable=False)

    latitude: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    district: Mapped[str | None] = mapped_column(String(100), default="Central Urban", nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), default="Eco State", nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), default="India", nullable=True)

    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="Pending", nullable=False)  # Pending, AI Processing, Verified, Resolved, Rejected

    eco_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    ai_prediction: Mapped[str | None] = mapped_column(String(100), nullable=True)
    admin_remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", backref="waste_reports")
    images = relationship("WasteImage", back_populates="report", cascade="all, delete-orphan")

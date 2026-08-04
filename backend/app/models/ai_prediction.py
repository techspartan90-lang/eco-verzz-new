import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    report_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("waste_reports.id", ondelete="SET NULL"),
        nullable=True
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    predicted_category: Mapped[str] = mapped_column(String(100), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.95, nullable=False)
    eco_points: Mapped[int] = mapped_column(Integer, default=25, nullable=False)

    recycling_method: Mapped[str | None] = mapped_column(Text, nullable=True)
    environmental_impact: Mapped[str | None] = mapped_column(Text, nullable=True)

    image_path: Mapped[str] = mapped_column(String(500), nullable=False)
    annotated_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    processing_time: Mapped[str] = mapped_column(String(50), default="0.25 sec", nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), default="EcoVerzz-YOLOv8-Vision", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationships
    user = relationship("User", backref="ai_predictions_history")
    report = relationship("WasteReport", backref="ai_predictions_history")

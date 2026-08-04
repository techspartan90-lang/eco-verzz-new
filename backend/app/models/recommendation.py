import uuid
from datetime import datetime
from sqlalchemy import String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class DecisionSupportRecommendation(Base):
    __tablename__ = "decision_support_recommendations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True
    )

    category: Mapped[str] = mapped_column(String(50), default="Route Optimization", nullable=False)  # Route Optimization, Resource Allocation, Eco Point Multiplier, Risk Prevention
    recommendation_text: Mapped[str] = mapped_column(Text, nullable=False)
    impact_score: Mapped[float] = mapped_column(Float, default=8.8, nullable=False)

    is_acted_upon: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationship
    user = relationship("User", backref="decision_support_list")

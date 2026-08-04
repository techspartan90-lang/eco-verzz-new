import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

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

    portfolio_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("portfolios.id", ondelete="SET NULL"),
        nullable=True
    )

    recommendation_type: Mapped[str] = mapped_column(String(100), default="Portfolio Optimization", nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, default=95.0, nullable=False)
    expected_return: Mapped[float] = mapped_column(Float, default=18.5, nullable=False)
    expected_risk: Mapped[float] = mapped_column(Float, default=4.2, nullable=False)

    recommendation_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationships
    user = relationship("User", backref="ai_recommendations")
    portfolio = relationship("Portfolio", backref="ai_recommendations")

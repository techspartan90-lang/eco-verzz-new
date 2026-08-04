import uuid
from datetime import datetime
from sqlalchemy import String, Float, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class PredictionRecord(Base):
    __tablename__ = "prediction_records"

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

    model_name: Mapped[str] = mapped_column(String(100), nullable=False)  # WasteForecastXGB, PollutionPredictor, RouteDelayOptimizer
    input_data_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    prediction_result_json: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.92, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationship
    user = relationship("User", backref="prediction_history")

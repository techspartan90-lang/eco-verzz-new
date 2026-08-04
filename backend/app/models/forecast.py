import uuid
from datetime import datetime, date
from sqlalchemy import String, Float, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.database.base import Base


class ForecastRecord(Base):
    __tablename__ = "forecast_records"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    forecast_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Waste Generation, Pollution AQI, Carbon Reduction, Collection Delay
    target_date: Mapped[date] = mapped_column(Date, nullable=False)
    predicted_value: Mapped[float] = mapped_column(Float, nullable=False)
    district: Mapped[str] = mapped_column(String(100), default="District 1 - Central Urban", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

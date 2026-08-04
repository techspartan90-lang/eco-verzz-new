import uuid
from datetime import datetime
from sqlalchemy import Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class EnvironmentData(Base):
    __tablename__ = "environment_data"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    device_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("devices.id", ondelete="CASCADE"),
        nullable=False
    )

    air_quality_aqi: Mapped[float] = mapped_column(Float, default=42.0, nullable=False)
    water_quality_ph: Mapped[float] = mapped_column(Float, default=7.2, nullable=False)
    temperature_c: Mapped[float] = mapped_column(Float, default=28.5, nullable=False)
    humidity_pct: Mapped[float] = mapped_column(Float, default=65.0, nullable=False)
    gas_leak_ppm: Mapped[float] = mapped_column(Float, default=12.0, nullable=False)
    fill_level_pct: Mapped[float] = mapped_column(Float, default=45.0, nullable=False)

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationship
    device = relationship("Device", back_populates="environment_records")

import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class Device(Base):
    __tablename__ = "devices"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    device_name: Mapped[str] = mapped_column(String(150), nullable=False)
    device_type: Mapped[str] = mapped_column(String(50), default="Smart Dustbin", nullable=False)  # Smart Dustbin, GPS Tracker, Air Quality Sensor, Water Sensor, Gas Sensor, Fill Level Sensor
    mac_address: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    latitude: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    status: Mapped[str] = mapped_column(String(30), default="Online", nullable=False)  # Online, Offline, Maintenance
    battery_level: Mapped[int] = mapped_column(Integer, default=100, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationships
    sensors = relationship("Sensor", back_populates="device", cascade="all, delete-orphan")
    environment_records = relationship("EnvironmentData", back_populates="device", cascade="all, delete-orphan")

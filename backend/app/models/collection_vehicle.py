import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class CollectionVehicle(Base):
    __tablename__ = "collection_vehicles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    vehicle_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    driver_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="En-Route", nullable=False)  # En-Route, Idle, Maintenance, Off-Duty

    current_latitude: Mapped[float] = mapped_column(Float, default=12.9716, nullable=False)
    current_longitude: Mapped[float] = mapped_column(Float, default=77.5946, nullable=False)
    speed_kmh: Mapped[float] = mapped_column(Float, default=35.0, nullable=False)
    fuel_pct: Mapped[float] = mapped_column(Float, default=85.0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationship
    location_history = relationship("LocationHistory", back_populates="vehicle", cascade="all, delete-orphan")

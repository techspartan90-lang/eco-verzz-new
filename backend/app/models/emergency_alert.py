import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class EmergencyAlert(Base):
    __tablename__ = "emergency_alerts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Flood, Fire, Pollution, Chemical Leak, Cyclone, Storm, Heatwave, Water Contamination, Illegal Dumping, Wildlife Emergency
    severity: Mapped[str] = mapped_column(String(20), default="High", nullable=False)  # Low, Medium, High, Critical
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    latitude: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    affected_radius_km: Mapped[float] = mapped_column(Float, default=10.0, nullable=False)

    status: Mapped[str] = mapped_column(String(30), default="Active", nullable=False)  # Active, Resolved

    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationship
    creator = relationship("User", backref="created_emergency_alerts")

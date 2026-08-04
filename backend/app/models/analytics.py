import uuid
from datetime import datetime, date
from sqlalchemy import Integer, Float, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.database.base import Base


class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    snapshot_date: Mapped[date] = mapped_column(Date, nullable=False)
    total_waste_kg: Mapped[float] = mapped_column(Float, default=12450.0, nullable=False)
    total_carbon_offset_tco2e: Mapped[float] = mapped_column(Float, default=48.5, nullable=False)
    active_citizens_count: Mapped[int] = mapped_column(Integer, default=1250, nullable=False)
    eco_points_distributed: Mapped[int] = mapped_column(Integer, default=45000, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.database.base import Base


class Fund(Base):
    __tablename__ = "funds"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    symbol: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    nav: Mapped[float] = mapped_column(Float, nullable=False)
    cagr_3yr: Mapped[float] = mapped_column(Float, nullable=False)
    returns_1yr: Mapped[float] = mapped_column(Float, nullable=False)
    expense_ratio: Mapped[float] = mapped_column(Float, nullable=False)
    sharpe_ratio: Mapped[float] = mapped_column(Float, nullable=False)
    sortino_ratio: Mapped[float] = mapped_column(Float, nullable=False)
    volatility: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(30), nullable=False)
    esg_rating: Mapped[str] = mapped_column(String(10), default="AAA")

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

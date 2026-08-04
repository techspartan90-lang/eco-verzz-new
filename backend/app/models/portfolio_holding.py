import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("portfolios.id", ondelete="CASCADE"),
        nullable=False
    )

    fund_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("funds.id", ondelete="SET NULL"),
        nullable=True
    )

    fund_name: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="Equity ESG", nullable=False)
    amc_name: Mapped[str] = mapped_column(String(100), default="EcoVerzz AMC", nullable=False)
    sector: Mapped[str] = mapped_column(String(100), default="Clean Tech & Energy", nullable=False)

    units: Mapped[float] = mapped_column(Float, nullable=False)
    purchase_price: Mapped[float] = mapped_column(Float, nullable=False)
    current_nav: Mapped[float] = mapped_column(Float, nullable=False)

    invested_amount: Mapped[float] = mapped_column(Float, default=0.0)
    current_value: Mapped[float] = mapped_column(Float, default=0.0)
    gain_loss: Mapped[float] = mapped_column(Float, default=0.0)
    gain_loss_percentage: Mapped[float] = mapped_column(Float, default=0.0)

    purchase_date: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationships
    portfolio = relationship("Portfolio", back_populates="holdings")
    fund = relationship("Fund", backref="holdings")

import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class InvestorProfile(Base):
    __tablename__ = "investor_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    age: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    annual_income: Mapped[float] = mapped_column(Float, default=1200000.0, nullable=False)
    investment_experience: Mapped[str] = mapped_column(String(50), default="Intermediate", nullable=False)
    risk_tolerance: Mapped[str] = mapped_column(String(50), default="Moderate", nullable=False)
    investment_goal: Mapped[str] = mapped_column(String(100), default="ESG Wealth Accumulation", nullable=False)
    monthly_investment: Mapped[float] = mapped_column(Float, default=25000.0, nullable=False)
    investment_horizon: Mapped[int] = mapped_column(Integer, default=5, nullable=False)  # years
    liquidity_requirement: Mapped[str] = mapped_column(String(50), default="Medium", nullable=False)
    preferred_categories: Mapped[str] = mapped_column(String(255), default="Equity ESG, Clean Tech", nullable=False)
    tax_bracket: Mapped[str] = mapped_column(String(50), default="30%", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationship
    user = relationship("User", backref="investor_profile")

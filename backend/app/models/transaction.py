import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

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
    transaction_type: Mapped[str] = mapped_column(String(30), nullable=False)  # BUY, SELL, SIP, REDEMPTION
    units: Mapped[float] = mapped_column(Float, nullable=False)
    nav: Mapped[float] = mapped_column(Float, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)

    transaction_date: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationships
    portfolio = relationship("Portfolio", back_populates="transactions")
    fund = relationship("Fund", backref="transactions")

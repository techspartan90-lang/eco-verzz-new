import uuid
from datetime import datetime
from sqlalchemy import String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database.base import Base


class CarbonCredit(Base):
    __tablename__ = "carbon_credits"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    token_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    credit_amount: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)  # in tCO2e
    origin_type: Mapped[str] = mapped_column(String(50), default="Tree Plantation", nullable=False)

    contract_address: Mapped[str] = mapped_column(String(42), default="0x71C7656EC7ab88b098defB751B7401B5f6d8976F", nullable=False)
    tx_hash: Mapped[str | None] = mapped_column(String(66), nullable=True)

    is_burned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationship
    user = relationship("User", backref="carbon_credits_portfolio")

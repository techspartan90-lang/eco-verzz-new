"""SQLAlchemy models for Enterprise Integrations (Phase 19)

All models use SQLAlchemy 2.0 Core/ORM style and are compatible with the async session
used throughout the EcoVerzz backend.
"""

import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import (
    Column,
    String,
    DateTime,
    JSON,
    Boolean,
    Integer,
    Float,
    Text,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Integration(Base):
    """Catalog of third‑party integrations.

    * ``name`` – Human readable name (e.g., "Stripe", "Google Maps").
    * ``type`` – Category such as ``payment``, ``gis``, ``crm`` etc.
    * ``config`` – Provider‑specific JSON configuration (API keys, endpoints).
    """

    __tablename__ = "integrations"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: str = Column(String, nullable=False)
    type: str = Column(String, nullable=False)
    config: Optional[dict] = Column(JSON, nullable=True)
    created_at: datetime = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    payments: List["Payment"] = relationship("Payment", back_populates="integration", cascade="all, delete-orphan")
    webhooks: List["Webhook"] = relationship("Webhook", back_populates="integration", cascade="all, delete-orphan")

class Payment(Base):
    """Payment transaction record.

    ``provider`` references the ``Integration`` of type ``payment``.
    """

    __tablename__ = "payments"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: uuid.UUID = Column(UUID(as_uuid=True), nullable=False)
    integration_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("integrations.id"), nullable=False)
    provider: str = Column(String, nullable=False)  # redundant for quick lookup (e.g., "stripe")
    amount: float = Column(Float, nullable=False)
    currency: str = Column(String(3), nullable=False, default="USD")
    status: str = Column(String, nullable=False)  # pending, succeeded, failed, refunded
    transaction_id: Optional[str] = Column(String, nullable=True)
    created_at: datetime = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    integration: Integration = relationship("Integration", back_populates="payments")

class ApiKey(Base):
    """API key for external developers or internal services.

    The raw key is never stored; only a salted hash is persisted.
    """

    __tablename__ = "api_keys"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key_hash: str = Column(String, nullable=False)  # bcrypt/argon2 hash
    owner_id: uuid.UUID = Column(UUID(as_uuid=True), nullable=False)
    scopes: Optional[dict] = Column(JSON, nullable=True)
    expires_at: Optional[datetime] = Column(DateTime, nullable=True)
    created_at: datetime = Column(DateTime, default=datetime.utcnow, nullable=False)

class AuditLog(Base):
    """Generic audit log for actions performed through the integration layer."""

    __tablename__ = "audit_logs"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), nullable=True)
    action: str = Column(String, nullable=False)
    resource_type: Optional[str] = Column(String, nullable=True)
    resource_id: Optional[uuid.UUID] = Column(UUID(as_uuid=True), nullable=True)
    timestamp: datetime = Column(DateTime, default=datetime.utcnow, nullable=False)
    details: Optional[dict] = Column(JSON, nullable=True)

class OAuthSession(Base):
    """Stores temporary OAuth2 session information for SSO flows."""

    __tablename__ = "oauth_sessions"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: uuid.UUID = Column(UUID(as_uuid=True), nullable=False)
    provider: str = Column(String, nullable=False)  # google, microsoft, github, apple, ldap, azure_ad
    session_token: str = Column(String, nullable=False)
    expires_at: datetime = Column(DateTime, nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.utcnow, nullable=False)

class Webhook(Base):
    """Registered webhook endpoint for a specific integration event."""

    __tablename__ = "webhooks"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    integration_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("integrations.id"), nullable=False)
    url: str = Column(Text, nullable=False)
    secret: Optional[str] = Column(String, nullable=True)  # HMAC secret for signature verification
    event_type: str = Column(String, nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.utcnow, nullable=False)

    integration: Integration = relationship("Integration", back_populates="webhooks")
    events: List["WebhookEvent"] = relationship("WebhookEvent", back_populates="webhook", cascade="all, delete-orphan")

class WebhookEvent(Base):
    """Individual delivery attempt for a webhook payload."""

    __tablename__ = "webhook_events"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    webhook_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("webhooks.id"), nullable=False)
    payload: dict = Column(JSON, nullable=False)
    status: str = Column(String, nullable=False)  # pending, delivered, failed
    attempts: int = Column(Integer, default=0, nullable=False)
    last_attempt_at: Optional[datetime] = Column(DateTime, nullable=True)
    created_at: datetime = Column(DateTime, default=datetime.utcnow, nullable=False)

    webhook: Webhook = relationship("Webhook", back_populates="events")

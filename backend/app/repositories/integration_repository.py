"""Repository layer for Phase 19 Enterprise Integrations.

Implements CRUD operations for the core integration models defined in
`backend/app/models/integration_models.py`. The repository follows the same
pattern as existing repositories (e.g., `ai_repository.py`) and uses a
SQLAlchemy ``Session`` instance injected at runtime.
"""

from typing import List, Optional
import uuid

from sqlalchemy.orm import Session

from app.models.integration_models import (
    Integration,
    Payment,
    ApiKey,
    AuditLog,
    OAuthSession,
    Webhook,
    WebhookEvent,
)


class IntegrationRepository:
    """Repository handling all integration‑related persistence operations."""

    def __init__(self, db: Session):
        self.db = db

    # ---------- Integration ----------
    def create_integration(
        self, name: str, type_: str, config: Optional[dict] = None
    ) -> Integration:
        integration = Integration(name=name, type=type_, config=config)
        self.db.add(integration)
        self.db.commit()
        self.db.refresh(integration)
        return integration

    def get_integration(self, integration_id: uuid.UUID) -> Optional[Integration]:
        return (
            self.db.query(Integration)
            .filter(Integration.id == integration_id)
            .first()
        )

    def list_integrations(self, type_: Optional[str] = None) -> List[Integration]:
        query = self.db.query(Integration)
        if type_:
            query = query.filter(Integration.type == type_)
        return query.all()

    def delete_integration(self, integration_id: uuid.UUID) -> bool:
        integration = self.get_integration(integration_id)
        if not integration:
            return False
        self.db.delete(integration)
        self.db.commit()
        return True

    # ---------- Payment ----------
    def save_payment(
        self,
        user_id: uuid.UUID,
        integration_id: uuid.UUID,
        provider: str,
        amount: float,
        currency: str,
        status: str,
        transaction_id: Optional[str] = None,
    ) -> Payment:
        payment = Payment(
            user_id=user_id,
            integration_id=integration_id,
            provider=provider,
            amount=amount,
            currency=currency,
            status=status,
            transaction_id=transaction_id,
        )
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def get_payment(self, payment_id: uuid.UUID) -> Optional[Payment]:
        return self.db.query(Payment).filter(Payment.id == payment_id).first()

    def list_payments_by_user(
        self, user_id: uuid.UUID, limit: int = 20
    ) -> List[Payment]:
        return (
            self.db.query(Payment)
            .filter(Payment.user_id == user_id)
            .order_by(Payment.created_at.desc())
            .limit(limit)
            .all()
        )

    # ---------- API Key ----------
    def create_api_key(
        self,
        key_hash: str,
        owner_id: uuid.UUID,
        scopes: Optional[dict] = None,
        expires_at: Optional[datetime] = None,
    ) -> ApiKey:
        api_key = ApiKey(
            key_hash=key_hash,
            owner_id=owner_id,
            scopes=scopes,
            expires_at=expires_at,
        )
        self.db.add(api_key)
        self.db.commit()
        self.db.refresh(api_key)
        return api_key

    def get_api_key(self, key_id: uuid.UUID) -> Optional[ApiKey]:
        return self.db.query(ApiKey).filter(ApiKey.id == key_id).first()

    # ---------- OAuth Session ----------
    def create_oauth_session(
        self,
        user_id: uuid.UUID,
        provider: str,
        session_token: str,
        expires_at: datetime,
    ) -> OAuthSession:
        session = OAuthSession(
            user_id=user_id,
            provider=provider,
            session_token=session_token,
            expires_at=expires_at,
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_oauth_session(self, token: str) -> Optional[OAuthSession]:
        return (
            self.db.query(OAuthSession)
            .filter(OAuthSession.session_token == token)
            .first()
        )

    # ---------- Webhook ----------
    def register_webhook(
        self,
        integration_id: uuid.UUID,
        url: str,
        secret: Optional[str],
        event_type: str,
    ) -> Webhook:
        webhook = Webhook(
            integration_id=integration_id,
            url=url,
            secret=secret,
            event_type=event_type,
        )
        self.db.add(webhook)
        self.db.commit()
        self.db.refresh(webhook)
        return webhook

    def get_webhook(self, webhook_id: uuid.UUID) -> Optional[Webhook]:
        return self.db.query(Webhook).filter(Webhook.id == webhook_id).first()

    def list_webhooks(self, integration_id: uuid.UUID) -> List[Webhook]:
        return (
            self.db.query(Webhook)
            .filter(Webhook.integration_id == integration_id)
            .all()
        )

    def deactivate_webhook(self, webhook_id: uuid.UUID) -> bool:
        webhook = self.get_webhook(webhook_id)
        if not webhook:
            return False
        webhook.is_active = False
        self.db.commit()
        return True

    # ---------- Webhook Event ----------
    def create_webhook_event(
        self, webhook_id: uuid.UUID, payload: dict, status: str = "pending"
    ) -> WebhookEvent:
        event = WebhookEvent(
            webhook_id=webhook_id,
            payload=payload,
            status=status,
            attempts=0,
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def update_event_status(
        self, event_id: uuid.UUID, status: str, attempts: int
    ) -> Optional[WebhookEvent]:
        event = self.db.query(WebhookEvent).filter(WebhookEvent.id == event_id).first()
        if not event:
            return None
        event.status = status
        event.attempts = attempts
        event.last_attempt_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(event)
        return event

    # ---------- Audit Log ----------
    def create_audit_log(
        self,
        user_id: Optional[uuid.UUID],
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[uuid.UUID] = None,
        details: Optional[dict] = None,
    ) -> AuditLog:
        log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

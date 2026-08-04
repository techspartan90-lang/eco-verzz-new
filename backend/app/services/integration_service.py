"""Service layer for Phase 19 Enterprise Integrations.
The service orchestrates calls to the repository layer and external provider
clients. It follows the existing repository‑service pattern used throughout
the EcoVerzz codebase.
"""

import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status

# Repository
from app.repositories.integration_repository import IntegrationRepository

# Models for external clients (placeholders – actual SDK calls are encapsulated
# in the integration modules under ``app/integrations/*``)
# Example import statements (the modules contain thin wrappers around the
# provider SDKs). They will be imported lazily inside the methods to avoid
# unnecessary dependencies at import time.

class IntegrationService:
    """High‑level business logic for all integration APIs.

    Each public method corresponds to a FastAPI endpoint defined in
    ``routes/integration.py``. Errors are raised as ``HTTPException`` which
    FastAPI converts into the standardized ``BaseResponse`` format.
    """

    def __init__(self, repo: IntegrationRepository):
        self.repo = repo

    # ---------- Integration Management ----------
    def create_integration(
        self, name: str, type_: str, config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        integration = self.repo.create_integration(name=name, type_=type_, config=config)
        return {
            "id": str(integration.id),
            "name": integration.name,
            "type": integration.type,
            "config": integration.config,
            "created_at": integration.created_at,
            "updated_at": integration.updated_at,
        }

    def list_integrations(self, type_: Optional[str] = None) -> List[Dict[str, Any]]:
        integrations = self.repo.list_integrations(type_ = type_)
        return [
            {
                "id": str(i.id),
                "name": i.name,
                "type": i.type,
                "config": i.config,
                "created_at": i.created_at,
                "updated_at": i.updated_at,
            }
            for i in integrations
        ]

    # ---------- Payment Processing ----------
    def process_payment(self, user_id: uuid.UUID, payload: Dict[str, Any]) -> Dict[str, Any]:
        integration_id = uuid.UUID(payload["integration_id"])
        integration = self.repo.get_integration(integration_id)
        if not integration or integration.type != "payment":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment integration not found")

        # Dynamically import the provider module based on config name or type
        provider_name = integration.name.lower().replace(" ", "_")
        try:
            provider_module = __import__(f"app.integrations.payment.{provider_name}", fromlist=["process_payment"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unsupported payment provider") from exc

        amount = payload["amount"]
        currency = payload.get("currency", "USD")
        payment_method = payload["payment_method"]
        metadata = payload.get("metadata", {})

        # Call the provider's ``process_payment`` function – it must return a dict
        # with at least ``status`` and ``transaction_id``.
        result = provider_module.process_payment(
            amount=amount,
            currency=currency,
            payment_method=payment_method,
            metadata=metadata,
        )

        payment_record = self.repo.save_payment(
            user_id=user_id,
            integration_id=integration_id,
            provider=integration.name,
            amount=amount,
            currency=currency,
            status=result.get("status", "failed"),
            transaction_id=result.get("transaction_id"),
        )

        return {
            "payment_id": str(payment_record.id),
            "status": payment_record.status,
            "transaction_id": payment_record.transaction_id,
            "provider": integration.name,
            "amount": payment_record.amount,
            "currency": payment_record.currency,
        }

    # ---------- Refund ----------
    def refund_payment(self, user_id: uuid.UUID, payment_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        payment_uuid = uuid.UUID(payment_id)
        payment = self.repo.get_payment(payment_uuid)
        if not payment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
        if payment.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to refund this payment")

        integration = self.repo.get_integration(payment.integration_id)
        if not integration:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Integration config missing")

        provider_name = integration.name.lower().replace(" ", "_")
        try:
            provider_module = __import__(f"app.integrations.payment.{provider_name}", fromlist=["refund_payment"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unsupported payment provider") from exc

        amount = payload.get("amount", payment.amount)
        result = provider_module.refund_payment(
            transaction_id=payment.transaction_id,
            amount=amount,
        )

        # Update payment status
        payment.status = result.get("status", "refunded")
        self.repo.db.commit()
        self.repo.db.refresh(payment)

        return {
            "payment_id": str(payment.id),
            "status": payment.status,
            "refunded_amount": amount,
        }

    # ---------- Payment History ----------
    def get_payment_history(self, user_id: uuid.UUID, limit: int = 20) -> List[Dict[str, Any]]:
        payments = self.repo.list_payments_by_user(user_id=user_id, limit=limit)
        return [
            {
                "id": str(p.id),
                "provider": p.provider,
                "amount": p.amount,
                "currency": p.currency,
                "status": p.status,
                "created_at": p.created_at,
                "transaction_id": p.transaction_id,
            }
            for p in payments
        ]

    # ---------- Webhook Management ----------
    def register_webhook(self, integration_id: str, url: str, secret: Optional[str], event_type: str) -> Dict[str, Any]:
        integration_uuid = uuid.UUID(integration_id)
        integration = self.repo.get_integration(integration_uuid)
        if not integration:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Integration not found")
        webhook = self.repo.register_webhook(
            integration_id=integration_uuid,
            url=url,
            secret=secret,
            event_type=event_type,
        )
        return {
            "id": str(webhook.id),
            "integration_id": str(integration_uuid),
            "url": webhook.url,
            "event_type": webhook.event_type,
            "is_active": webhook.is_active,
            "created_at": webhook.created_at,
        }

    def list_webhooks(self, integration_id: str) -> List[Dict[str, Any]]:
        integration_uuid = uuid.UUID(integration_id)
        webhooks = self.repo.list_webhooks(integration_uuid)
        return [
            {
                "id": str(w.id),
                "url": w.url,
                "event_type": w.event_type,
                "is_active": w.is_active,
                "created_at": w.created_at,
            }
            for w in webhooks
        ]

    # ---------- OAuth2 / SSO ----------
    def initiate_oauth(self, provider: str, redirect_uri: str, state: Optional[str]) -> Dict[str, Any]:
        # Provider modules live under ``app.integrations.microsoft`` etc.
        try:
            provider_module = __import__(f"app.integrations.{provider}.oauth", fromlist=["get_authorization_url"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported OAuth provider") from exc
        auth_url = provider_module.get_authorization_url(redirect_uri=redirect_uri, state=state)
        return {"authorization_url": auth_url}

    def handle_oauth_callback(self, provider: str, code: str, state: Optional[str]) -> Dict[str, Any]:
        try:
            provider_module = __import__(f"app.integrations.{provider}.oauth", fromlist=["exchange_code"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported OAuth provider") from exc
        token_data = provider_module.exchange_code(code=code)
        # Persist session (example implementation)
        session = self.repo.create_oauth_session(
            user_id=uuid.UUID(token_data["user_id"]),
            provider=provider,
            session_token=token_data["access_token"],
            expires_at=datetime.utcnow() + timedelta(seconds=token_data.get("expires_in", 3600)),
        )
        return {"session_id": str(session.id), "access_token": token_data["access_token"]}

    # ---------- GIS Services ----------
    def geocode(self, address: str, provider: Optional[str] = None) -> Dict[str, Any]:
        # Resolve provider module
        provider_name = provider or "google_maps"
        try:
            provider_module = __import__(f"app.integrations.gis.{provider_name}", fromlist=["geocode"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported GIS provider") from exc
        result = provider_module.geocode(address=address)
        return result

    def reverse_geocode(self, latitude: float, longitude: float, provider: Optional[str] = None) -> Dict[str, Any]:
        provider_name = provider or "google_maps"
        try:
            provider_module = __import__(f"app.integrations.gis.{provider_name}", fromlist=["reverse_geocode"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported GIS provider") from exc
        return provider_module.reverse_geocode(lat=latitude, lng=longitude)

    def route(self, origin: str, destination: str, provider: Optional[str] = None) -> Dict[str, Any]:
        provider_name = provider or "google_maps"
        try:
            provider_module = __import__(f"app.integrations.gis.{provider_name}", fromlist=["route"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported GIS provider") from exc
        return provider_module.route(origin=origin, destination=destination)

    # ---------- Communication (Email / SMS / WhatsApp) ----------
    def send_email(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Choose provider based on configuration – default to SendGrid
        provider_module = __import__("app.integrations.communication.sendgrid", fromlist=["send_email"])
        result = provider_module.send_email(**payload)
        return result

    def send_sms(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        provider_module = __import__("app.integrations.communication.twilio", fromlist=["send_sms"])
        return provider_module.send_sms(**payload)

    def send_whatsapp(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        provider_module = __import__("app.integrations.communication.whatsapp", fromlist=["send_message"])
        return provider_module.send_message(**payload)

    # ---------- AI Provider Gateway ----------
    def chat(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        provider = payload["provider"]
        try:
            provider_module = __import__(f"app.integrations.ai.{provider}", fromlist=["chat"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported AI provider") from exc
        return provider_module.chat(**payload)

    def generate_image(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        provider = payload["provider"]
        try:
            provider_module = __import__(f"app.integrations.ai.{provider}", fromlist=["generate_image"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported AI provider") from exc
        return provider_module.generate_image(**payload)

    def process_document(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        provider = payload["provider"]
        try:
            provider_module = __import__(f"app.integrations.ai.{provider}", fromlist=["process_document"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported AI provider") from exc
        return provider_module.process_document(**payload)

    # ---------- ERP / CRM Synchronization ----------
    def sync_erp(self, integration_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        integration_uuid = uuid.UUID(integration_id)
        integration = self.repo.get_integration(integration_uuid)
        if not integration or integration.type != "erp":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ERP integration not found")
        provider = integration.name.lower().replace(" ", "_")
        try:
            provider_module = __import__(f"app.integrations.erp.{provider}", fromlist=["sync"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unsupported ERP provider") from exc
        result = provider_module.sync(payload)
        # Optionally log audit
        self.repo.create_audit_log(user_id=None, action="erp_sync", resource_type="erp", resource_id=integration_uuid, details=payload)
        return result

    def sync_crm(self, integration_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        integration_uuid = uuid.UUID(integration_id)
        integration = self.repo.get_integration(integration_uuid)
        if not integration or integration.type != "crm":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CRM integration not found")
        provider = integration.name.lower().replace(" ", "_")
        try:
            provider_module = __import__(f"app.integrations.crm.{provider}", fromlist=["sync"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unsupported CRM provider") from exc
        result = provider_module.sync(payload)
        self.repo.create_audit_log(user_id=None, action="crm_sync", resource_type="crm", resource_id=integration_uuid, details=payload)
        return result

    # ---------- Government Sync ----------
    def sync_government(self, integration_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        integration_uuid = uuid.UUID(integration_id)
        integration = self.repo.get_integration(integration_uuid)
        if not integration or integration.type != "government":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Government integration not found")
        provider = integration.name.lower().replace(" ", "_")
        try:
            provider_module = __import__(f"app.integrations.government.{provider}", fromlist=["sync"])
        except ImportError as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unsupported government provider") from exc
        result = provider_module.sync(payload)
        self.repo.create_audit_log(user_id=None, action="government_sync", resource_type="government", resource_id=integration_uuid, details=payload)
        return result

    # ---------- Status ----------
    def health_status(self) -> Dict[str, Any]:
        return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

    # Additional helper methods (rate limiting, API key validation) would be
    # implemented as FastAPI dependencies elsewhere in the project.

    # ---------- Audit Log ----------
    def log_audit(self, user_id: Optional[uuid.UUID], action: str, resource_type: Optional[str] = None, resource_id: Optional[uuid.UUID] = None, details: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        log = self.repo.create_audit_log(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
        )
        return {"log_id": str(log.id), "created_at": log.timestamp}

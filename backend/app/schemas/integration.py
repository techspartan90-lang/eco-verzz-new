"""Pydantic v2 schemas for Enterprise Integration layer (Phase 19).
These schemas are used for request validation and OpenAPI documentation.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, ConfigDict

# -------------------- Generic Response Wrapper --------------------
class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    success: bool = Field(..., description="Indicates if the operation succeeded")
    message: str = Field(..., description="Human‑readable message describing the result")
    data: Optional[Any] = Field(None, description="Payload containing the result data")

# -------------------- Integration Models --------------------
class IntegrationCreateRequest(BaseModel):
    name: str = Field(..., description="Human readable name of the integration (e.g., Stripe)")
    type: str = Field(..., description="Category such as payment, gis, crm, erp, ai, communication, government")
    config: Optional[Dict[str, Any]] = Field(None, description="Provider‑specific configuration JSON")

class IntegrationResponse(BaseModel):
    id: str = Field(..., description="UUID of the integration")
    name: str
    type: str
    config: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

# -------------------- Payment Schemas --------------------
class PaymentCreateRequest(BaseModel):
    integration_id: str = Field(..., description="UUID of the payment provider integration")
    amount: float = Field(..., gt=0, description="Amount to charge")
    currency: str = Field(default="USD", min_length=3, max_length=3, description="ISO 4217 currency code")
    payment_method: str = Field(..., description="Identifier of the payment method/token")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Arbitrary metadata passed to the provider")

class PaymentResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- Webhook Schemas --------------------
class WebhookRegisterRequest(BaseModel):
    integration_id: str = Field(..., description="Integration that will emit events")
    url: str = Field(..., description="Target URL for webhook delivery")
    secret: Optional[str] = Field(None, description="Secret used for HMAC signature verification")
    event_type: str = Field(..., description="Event type to subscribe to")

class WebhookResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- OAuth Schemas --------------------
class OAuthLoginRequest(BaseModel):
    provider: str = Field(..., description="OAuth provider identifier (google, microsoft, github, apple, ldap, azure_ad)")
    redirect_uri: str = Field(..., description="Client redirect URI registered with the provider")
    state: Optional[str] = Field(None, description="Opaque value to maintain state between request and callback")

class OAuthCallbackResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- GIS Schemas --------------------
class GeocodeRequest(BaseModel):
    address: str = Field(..., description="Human readable address to geocode")
    provider: Optional[str] = Field(None, description="GIS provider (google, mapbox, openstreetmap, arcgis)")

class GeocodeResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

class ReverseGeocodeRequest(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    provider: Optional[str] = Field(None, description="GIS provider")

class RouteRequest(BaseModel):
    origin: str = Field(..., description="Starting point (address or lat,lng)")
    destination: str = Field(..., description="Destination point (address or lat,lng)")
    provider: Optional[str] = Field(None, description="GIS provider")

class MapResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- Communication Schemas --------------------
class EmailRequest(BaseModel):
    to: List[str] = Field(..., description="Recipient email addresses")
    subject: str = Field(...)
    body: str = Field(...)
    template_id: Optional[str] = Field(None, description="Optional transactional template identifier")
    attachments: Optional[List[Dict[str, Any]]] = Field(None, description="List of attachment metadata")

class SMSRequest(BaseModel):
    to: str = Field(..., description="Phone number in E.164 format")
    message: str = Field(..., max_length=1600)
    provider: Optional[str] = Field(None, description="SMS provider identifier (twilio, etc.)")

class WhatsAppRequest(SMSRequest):
    pass

class CommunicationResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- AI Provider Schemas --------------------
class AIChatRequest(BaseModel):
    provider: str = Field(..., description="AI provider (openai, gemini, claude, ollama, huggingface)")
    model: str = Field(..., description="Model name to use")
    messages: List[Dict[str, str]] = Field(..., description="List of role/content messages for chat")
    temperature: Optional[float] = Field(0.7, ge=0, le=2)

class AIImageRequest(BaseModel):
    provider: str = Field(...)
    prompt: str = Field(...)
    n: int = Field(1, ge=1, le=10)
    size: Optional[str] = Field("1024x1024")

class AIDocumentRequest(BaseModel):
    provider: str = Field(...)
    document_url: str = Field(..., description="URL to the document to analyse")
    task: str = Field(..., description="Task to perform (summarize, extract, classify)")

class AIResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- ERP/CRM Sync Schemas --------------------
class SyncRequest(BaseModel):
    integration_id: str = Field(..., description="ERP or CRM integration identifier")
    payload: Dict[str, Any] = Field(..., description="Data payload to sync")
    action: str = Field(..., description="Action type (create, update, delete)")

class SyncResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- Government Sync Schemas --------------------
class GovernmentSyncRequest(SyncRequest):
    pass

class GovernmentSyncResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

# -------------------- Status Endpoint --------------------
class StatusResponse(BaseResponse):
    data: Optional[Dict[str, Any]] = None

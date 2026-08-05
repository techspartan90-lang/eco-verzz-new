from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class MintPayload(BaseModel):
    recipient_address: str = Field(..., min_length=10, max_length=50)
    credit_amount: float = Field(..., gt=0.0)
    origin_type: str = Field(default="Tree Plantation", example="Tree Plantation")  # Tree Plantation, Plastic Recycling, Solar Power


class VerifyPayload(BaseModel):
    tx_hash: str = Field(..., min_length=10, max_length=100)


class CarbonCreditResponse(BaseModel):
    id: UUID
    token_id: str
    credit_amount: float
    origin_type: str
    contract_address: str
    tx_hash: Optional[str]
    is_burned: bool
    created_at: datetime

    class Config:
        from_attributes = True


class BlockchainTxResponse(BaseModel):
    id: UUID
    transaction_type: str
    amount: float
    currency_type: str
    counterparty_address: Optional[str]
    tx_hash: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

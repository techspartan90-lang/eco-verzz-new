from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class WalletCreatePayload(BaseModel):
    wallet_address: Optional[str] = Field(None, min_length=10, max_length=50)


class WalletTransferPayload(BaseModel):
    recipient_address: str = Field(..., min_length=10, max_length=50)
    amount: float = Field(..., gt=0.0)
    currency_type: str = Field(default="EcoPoints", example="EcoPoints")  # EcoPoints, CarbonCredits


class DepositPayload(BaseModel):
    amount: float = Field(..., gt=0.0)
    currency_type: str = Field(default="EcoPoints")


class WalletResponse(BaseModel):
    id: UUID
    user_id: UUID
    wallet_address: str
    eco_points_balance: int
    carbon_credits_balance: float
    created_at: datetime

    class Config:
        from_attributes = True


class BalanceResponse(BaseModel):
    eco_points_balance: int
    carbon_credits_balance: float
    wallet_address: str

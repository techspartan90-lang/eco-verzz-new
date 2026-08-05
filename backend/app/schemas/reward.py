from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class RedeemPayload(BaseModel):
    item_id: UUID
    quantity: int = Field(default=1, ge=1)


class RewardResponse(BaseModel):
    id: UUID
    user_id: UUID
    reward_name: str
    points_cost: int
    category: str
    qr_code_data: Optional[str]
    is_redeemed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MarketplaceItemResponse(BaseModel):
    id: UUID
    item_name: str
    category: str
    points_price: int
    stock_quantity: int
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CouponResponse(BaseModel):
    id: UUID
    code: str
    discount_percentage: float
    partner_name: str
    is_used: bool
    expires_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

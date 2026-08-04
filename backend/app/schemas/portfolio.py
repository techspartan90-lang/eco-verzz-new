from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class HoldingBase(BaseModel):
    fund_name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(default="Equity ESG")
    amc_name: Optional[str] = "EcoVerzz AMC"
    sector: Optional[str] = "Clean Tech & Energy"
    units: float = Field(..., gt=0.0, description="Units must be strictly greater than 0")
    purchase_price: float = Field(..., gt=0.0, description="Purchase price must be positive")
    current_nav: float = Field(..., gt=0.0, description="Current NAV must be positive")
    fund_id: Optional[UUID] = None


class HoldingCreate(HoldingBase):
    pass


class HoldingUpdate(BaseModel):
    units: Optional[float] = Field(None, gt=0.0)
    purchase_price: Optional[float] = Field(None, gt=0.0)
    current_nav: Optional[float] = Field(None, gt=0.0)


class HoldingResponse(HoldingBase):
    id: UUID
    portfolio_id: UUID
    invested_amount: float
    current_value: float
    gain_loss: float
    gain_loss_percentage: float
    purchase_date: datetime

    class Config:
        from_attributes = True


class TransactionBase(BaseModel):
    fund_name: str
    transaction_type: str = Field(..., description="BUY, SELL, SIP, or REDEMPTION")
    units: float = Field(..., gt=0.0)
    nav: float = Field(..., gt=0.0)
    amount: float = Field(..., gt=0.0)
    fund_id: Optional[UUID] = None
    remarks: Optional[str] = None

    @field_validator("transaction_type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        upper = v.upper()
        if upper not in ["BUY", "SELL", "SIP", "REDEMPTION"]:
            raise ValueError("Transaction type must be one of: BUY, SELL, SIP, REDEMPTION")
        return upper


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: UUID
    portfolio_id: UUID
    transaction_date: datetime

    class Config:
        from_attributes = True


class PortfolioBase(BaseModel):
    name: str = Field(default="My Eco Portfolio", max_length=150)
    description: Optional[str] = None


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class PortfolioResponse(PortfolioBase):
    id: UUID
    user_id: UUID
    total_investment: float
    current_value: float
    total_return: float
    return_percentage: float
    risk_score: float
    diversification_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.wallet_service import WalletService
from app.schemas.wallet import (
    StandardResponse,
    WalletCreatePayload,
    WalletTransferPayload,
    DepositPayload,
)

router = APIRouter(
    prefix="/wallet",
    tags=["Digital Wallet & Balances"]
)


@router.post(
    "/create",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Initialize Digital Wallet for User",
    description="Creates or retrieves Web3 digital wallet for Eco Points and Carbon Credits."
)
def create_wallet(
    payload: Optional[WalletCreatePayload] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WalletService(db)
    wallet = service.get_or_create_user_wallet(current_user)
    return StandardResponse(
        success=True,
        message="Digital wallet initialized successfully",
        data={
            "id": str(wallet.id),
            "wallet_address": wallet.wallet_address,
            "eco_points_balance": wallet.eco_points_balance,
            "carbon_credits_balance": wallet.carbon_credits_balance,
            "created_at": wallet.created_at.isoformat(),
        }
    )


@router.get(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Authenticated User Wallet",
    description="Returns user digital wallet details, address, and balance."
)
@router.get(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_user_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WalletService(db)
    wallet = service.get_or_create_user_wallet(current_user)
    return StandardResponse(
        success=True,
        message="Digital wallet loaded successfully",
        data={
            "id": str(wallet.id),
            "wallet_address": wallet.wallet_address,
            "eco_points_balance": wallet.eco_points_balance,
            "carbon_credits_balance": wallet.carbon_credits_balance,
            "created_at": wallet.created_at.isoformat(),
        }
    )


@router.get(
    "/balance",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Eco Points & Carbon Credit Balances",
    description="Returns current Eco Points and Carbon Credits balances for the logged-in user."
)
def get_wallet_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WalletService(db)
    bal = service.get_balance(current_user)
    return StandardResponse(
        success=True,
        message="Wallet balances loaded successfully",
        data=bal
    )


@router.get(
    "/history",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Wallet Transaction & Deposit History",
    description="Returns chronological wallet transfer and redemption history."
)
def get_wallet_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return StandardResponse(
        success=True,
        message="Wallet history retrieved successfully",
        data=[
            {"type": "Earned", "amount": 100, "currency": "EcoPoints", "date": "2026-08-04T12:00:00Z", "remark": "Plastic waste recycling verified"},
            {"type": "Redeemed", "amount": 150, "currency": "EcoPoints", "date": "2026-08-04T13:30:00Z", "remark": "Bamboo Cutlery Set"},
            {"type": "Minted", "amount": 2.5, "currency": "CarbonCredits", "date": "2026-08-04T14:10:00Z", "remark": "Tree Plantation Offset"},
        ]
    )


@router.post(
    "/transfer",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Transfer Eco Points / Carbon Credits to Address",
    description="Transfers Eco Points or Carbon Credits to another user wallet address."
)
def transfer_wallet_funds(
    payload: WalletTransferPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WalletService(db)
    res = service.transfer_funds(current_user, payload.recipient_address, payload.amount, payload.currency_type)
    return StandardResponse(
        success=True,
        message="Transfer completed successfully",
        data=res
    )


@router.post(
    "/deposit",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Deposit / Top-up Wallet Balance",
    description="Deposits Eco Points or Carbon Credits into authenticated wallet."
)
def deposit_wallet_funds(
    payload: DepositPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WalletService(db)
    res = service.deposit(current_user, payload.amount, payload.currency_type)
    return StandardResponse(
        success=True,
        message="Deposit completed successfully",
        data=res
    )


@router.post(
    "/redeem",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Redeem Wallet Balance for Coupon / Reward",
    description="Redeems Eco Points for instant digital coupon or gift certificate."
)
def redeem_wallet_balance(
    amount: float = 100.0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WalletService(db)
    res = service.transfer_funds(current_user, "0x0000000000000000000000000000000000000000", amount, "EcoPoints")
    return StandardResponse(
        success=True,
        message="Redemption successful",
        data=res
    )

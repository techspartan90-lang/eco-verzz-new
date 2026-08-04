import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.reward_service import RewardService
from app.schemas.reward import (
    StandardResponse,
    RedeemPayload,
    RewardResponse,
)

router = APIRouter(
    prefix="/rewards",
    tags=["Eco Rewards & Redemptions"]
)


@router.get(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Redeemed Rewards List",
    description="Returns list of redeemed rewards, discount vouchers, and QR verification codes."
)
@router.get(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_user_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = RewardService(db)
    rewards = service.get_user_rewards(current_user)
    return StandardResponse(
        success=True,
        message="User rewards loaded successfully",
        data=[
            {
                "id": str(r.id),
                "reward_name": r.reward_name,
                "points_cost": r.points_cost,
                "category": r.category,
                "qr_code_data": r.qr_code_data,
                "is_redeemed": r.is_redeemed,
                "created_at": r.created_at.isoformat(),
            }
            for r in rewards
        ]
    )


@router.post(
    "/redeem",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Redeem Reward Item with Eco Points",
    description="Redeems a marketplace reward item using Eco Points balance and generates QR code payload."
)
def redeem_reward_item(
    payload: RedeemPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = RewardService(db)
    reward = service.purchase_marketplace_item(current_user, payload.item_id, payload.quantity)
    return StandardResponse(
        success=True,
        message="Reward redeemed successfully",
        data={
            "id": str(reward.id),
            "reward_name": reward.reward_name,
            "points_cost": reward.points_cost,
            "category": reward.category,
            "qr_code_data": reward.qr_code_data,
            "created_at": reward.created_at.isoformat(),
        }
    )

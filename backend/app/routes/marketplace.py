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
    MarketplaceItemResponse,
)

router = APIRouter(
    prefix="/marketplace",
    tags=["Eco Marketplace & CSR Platform"]
)


@router.get(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Marketplace Items Catalog",
    description="Returns available eco-friendly products, discount coupons, tree sponsorship packages, and CSR rewards."
)
@router.get(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_marketplace_catalog(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = RewardService(db)
    items = service.get_marketplace_items()
    return StandardResponse(
        success=True,
        message="Marketplace catalog loaded successfully",
        data=[
            {
                "id": str(i.id),
                "item_name": i.item_name,
                "category": i.category,
                "points_price": i.points_price,
                "stock_quantity": i.stock_quantity,
                "description": i.description,
                "created_at": i.created_at.isoformat(),
            }
            for i in items
        ]
    )


@router.get(
    "/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Marketplace Item Details by ID",
    description="Returns item specifications, price in Eco Points, and stock availability."
)
def get_marketplace_item_details(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = RewardService(db)
    item = service.get_item_by_id(id)
    return StandardResponse(
        success=True,
        message="Marketplace item loaded successfully",
        data={
            "id": str(item.id),
            "item_name": item.item_name,
            "category": item.category,
            "points_price": item.points_price,
            "stock_quantity": item.stock_quantity,
            "description": item.description,
            "created_at": item.created_at.isoformat(),
        }
    )


@router.post(
    "/purchase",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Purchase Marketplace Item",
    description="Purchases an item using Eco Points balance."
)
def purchase_marketplace_item(
    payload: RedeemPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = RewardService(db)
    reward = service.purchase_marketplace_item(current_user, payload.item_id, payload.quantity)
    return StandardResponse(
        success=True,
        message="Item purchased successfully",
        data={
            "id": str(reward.id),
            "reward_name": reward.reward_name,
            "points_cost": reward.points_cost,
            "qr_code_data": reward.qr_code_data,
        }
    )

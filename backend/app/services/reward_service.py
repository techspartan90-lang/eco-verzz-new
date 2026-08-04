import uuid
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.reward_repository import RewardRepository
from app.repositories.wallet_repository import WalletRepository
from app.utils.qr_generator import QRCodeGenerator
from app.models.reward import Reward
from app.models.marketplace_item import MarketplaceItem
from app.models.user import User


class RewardService:
    """
    Business logic layer for Eco Rewards Marketplace, Coupon Redemptions, and QR Code Certificates.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = RewardRepository(db)
        self.wallet_repo = WalletRepository(db)

    def get_marketplace_items(self) -> List[MarketplaceItem]:
        return self.repository.get_marketplace_items()

    def get_item_by_id(self, item_id: uuid.UUID) -> MarketplaceItem:
        item = self.repository.get_marketplace_item_by_id(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Marketplace item not found")
        return item

    def purchase_marketplace_item(self, current_user: User, item_id: uuid.UUID, quantity: int = 1) -> Reward:
        item = self.get_item_by_id(item_id)
        total_cost = item.points_price * quantity

        wallet = self.wallet_repo.get_or_create_wallet(current_user.id)
        if wallet.eco_points_balance < total_cost:
            raise HTTPException(status_code=400, detail="Insufficient Eco Points for purchase")

        # Deduct balance
        self.wallet_repo.update_balance(current_user.id, eco_points_delta=-total_cost)

        # Generate QR code verification payload
        qr_payload = f"ECOVERZZ-REWARD-{current_user.id}-{item.id}-{uuid.uuid4().hex[:8]}"
        qr_data_uri = QRCodeGenerator.generate_qr_code_base64(qr_payload)

        # Record reward redemption
        reward = self.repository.redeem_reward(
            user_id=current_user.id,
            reward_name=item.item_name,
            points_cost=total_cost,
            category=item.category,
            qr_code_data=qr_data_uri,
        )
        return reward

    def get_user_rewards(self, current_user: User) -> List[Reward]:
        return self.repository.get_user_rewards(current_user.id)

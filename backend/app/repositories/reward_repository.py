import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.reward import Reward
from app.models.marketplace_item import MarketplaceItem
from app.models.coupon import Coupon


class RewardRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for Rewards & Marketplace items.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_marketplace_items(self) -> List[MarketplaceItem]:
        items = self.db.query(MarketplaceItem).all()
        if not items:
            # Seed default marketplace items
            item1 = MarketplaceItem(
                item_name="Bamboo Reusable Cutlery Set & Tote Bag",
                category="Eco Products",
                points_price=150,
                stock_quantity=50,
                description="Sustainable 100% natural bamboo cutlery set with organic cotton carry pouch.",
            )
            item2 = MarketplaceItem(
                item_name="25% Off Organic Grocery Coupon",
                category="Discount Coupons",
                points_price=200,
                stock_quantity=100,
                description="Valid at all partner organic supermarket locations nationwide.",
            )
            item3 = MarketplaceItem(
                item_name="Plant 5 Native Trees (Carbon Offset Sponsorship)",
                category="Tree Sponsorship",
                points_price=300,
                stock_quantity=200,
                description="Direct sponsorship for planting 5 native forest saplings with GPS geo-location track.",
            )
            self.db.add_all([item1, item2, item3])
            self.db.commit()
            items = [item1, item2, item3]
        return items

    def get_marketplace_item_by_id(self, item_id: uuid.UUID) -> Optional[MarketplaceItem]:
        return self.db.query(MarketplaceItem).filter(MarketplaceItem.id == item_id).first()

    def redeem_reward(
        self,
        user_id: uuid.UUID,
        reward_name: str,
        points_cost: int,
        category: str = "Coupon",
        qr_code_data: Optional[str] = None,
    ) -> Reward:
        reward = Reward(
            user_id=user_id,
            reward_name=reward_name,
            points_cost=points_cost,
            category=category,
            qr_code_data=qr_code_data,
            is_redeemed=False,
        )
        self.db.add(reward)
        self.db.commit()
        self.db.refresh(reward)
        return reward

    def get_user_rewards(self, user_id: uuid.UUID) -> List[Reward]:
        return self.db.query(Reward).filter(Reward.user_id == user_id).order_by(Reward.created_at.desc()).all()

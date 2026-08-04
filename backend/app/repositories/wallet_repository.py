import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.wallet import Wallet
from app.models.transaction import Transaction


class WalletRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for Wallet & Balance queries.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_or_create_wallet(self, user_id: uuid.UUID, wallet_address: Optional[str] = None) -> Wallet:
        wallet = self.db.query(Wallet).filter(Wallet.user_id == user_id).first()
        if not wallet:
            addr = wallet_address or f"0x{uuid.uuid4().hex[:40]}"
            wallet = Wallet(
                user_id=user_id,
                wallet_address=addr,
                eco_points_balance=640,
                carbon_credits_balance=15.5,
            )
            self.db.add(wallet)
            self.db.commit()
            self.db.refresh(wallet)
        return wallet

    def get_wallet(self, user_id: uuid.UUID) -> Optional[Wallet]:
        return self.db.query(Wallet).filter(Wallet.user_id == user_id).first()

    def update_balance(
        self,
        user_id: uuid.UUID,
        eco_points_delta: int = 0,
        carbon_credits_delta: float = 0.0,
    ) -> Optional[Wallet]:
        wallet = self.get_or_create_wallet(user_id)
        wallet.eco_points_balance += eco_points_delta
        wallet.carbon_credits_balance += carbon_credits_delta
        self.db.commit()
        self.db.refresh(wallet)
        return wallet

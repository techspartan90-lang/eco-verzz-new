import uuid
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.wallet_repository import WalletRepository
from app.models.wallet import Wallet
from app.models.user import User


class WalletService:
    """
    Business logic layer for Digital Wallets, Eco Points & Carbon Credit balance management.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = WalletRepository(db)

    def get_or_create_user_wallet(self, current_user: User) -> Wallet:
        return self.repository.get_or_create_wallet(current_user.id)

    def get_balance(self, current_user: User) -> Dict[str, Any]:
        wallet = self.get_or_create_user_wallet(current_user)
        return {
            "wallet_address": wallet.wallet_address,
            "eco_points_balance": wallet.eco_points_balance,
            "carbon_credits_balance": wallet.carbon_credits_balance,
        }

    def transfer_funds(
        self,
        current_user: User,
        recipient_address: str,
        amount: float,
        currency_type: str = "EcoPoints",
    ) -> Dict[str, Any]:
        wallet = self.get_or_create_user_wallet(current_user)

        if currency_type == "EcoPoints":
            if wallet.eco_points_balance < int(amount):
                raise HTTPException(status_code=400, detail="Insufficient Eco Points balance")
            self.repository.update_balance(current_user.id, eco_points_delta=-int(amount))
        else:
            if wallet.carbon_credits_balance < amount:
                raise HTTPException(status_code=400, detail="Insufficient Carbon Credits balance")
            self.repository.update_balance(current_user.id, carbon_credits_delta=-amount)

        return {
            "sender_address": wallet.wallet_address,
            "recipient_address": recipient_address,
            "amount": amount,
            "currency_type": currency_type,
            "status": "Transferred",
            "tx_hash": f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:32]}",
        }

    def deposit(self, current_user: User, amount: float, currency_type: str = "EcoPoints") -> Dict[str, Any]:
        if currency_type == "EcoPoints":
            wallet = self.repository.update_balance(current_user.id, eco_points_delta=int(amount))
        else:
            wallet = self.repository.update_balance(current_user.id, carbon_credits_delta=amount)

        return {
            "wallet_address": wallet.wallet_address,
            "amount": amount,
            "currency_type": currency_type,
            "new_eco_points_balance": wallet.eco_points_balance,
            "new_carbon_credits_balance": wallet.carbon_credits_balance,
        }

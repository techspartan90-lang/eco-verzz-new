import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.repositories.transaction_repository import TransactionRepository
from app.models.transaction import Transaction
from app.models.user import User


class TransactionService:
    """
    Business logic layer for Wallet & Blockchain Transaction Audit History.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = TransactionRepository(db)

    def get_user_transactions(self, current_user: User, limit: int = 50) -> List[Transaction]:
        return self.repository.get_transactions(current_user.id, limit)

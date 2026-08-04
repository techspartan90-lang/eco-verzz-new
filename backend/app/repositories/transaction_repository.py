import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.carbon_credit import CarbonCredit


class TransactionRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for Wallet Transactions & Carbon Credit NFTs.
    """

    def __init__(self, db: Session):
        self.db = db

    def save_transaction(
        self,
        user_id: uuid.UUID,
        transaction_type: str,
        amount: float,
        currency_type: str = "EcoPoints",
        counterparty_address: Optional[str] = None,
        tx_hash: Optional[str] = None,
        status: str = "Completed",
    ) -> Transaction:
        tx = Transaction(
            portfolio_id=user_id,  # reused for user_id mapping
            transaction_type=transaction_type,
            amount=amount,
            nav=1.0,
            units=amount,
            remarks=f"{currency_type} {transaction_type} - {counterparty_address or 'System'}",
        )
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(tx)
        return tx

    def mint_carbon_credit(
        self,
        user_id: uuid.UUID,
        token_id: str,
        credit_amount: float,
        origin_type: str,
        contract_address: str,
        tx_hash: str,
    ) -> CarbonCredit:
        credit = CarbonCredit(
            user_id=user_id,
            token_id=token_id,
            credit_amount=credit_amount,
            origin_type=origin_type,
            contract_address=contract_address,
            tx_hash=tx_hash,
            is_burned=False,
        )
        self.db.add(credit)
        self.db.commit()
        self.db.refresh(credit)
        return credit

    def get_user_carbon_credits(self, user_id: uuid.UUID) -> List[CarbonCredit]:
        return self.db.query(CarbonCredit).filter(CarbonCredit.user_id == user_id).order_by(CarbonCredit.created_at.desc()).all()

    def get_transactions(self, user_id: uuid.UUID, limit: int = 50) -> List[Transaction]:
        return self.db.query(Transaction).filter(
            Transaction.portfolio_id == user_id
        ).order_by(Transaction.transaction_date.desc()).limit(limit).all()

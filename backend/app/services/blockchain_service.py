import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.blockchain.mint import CarbonCreditMintEngine
from app.blockchain.verify import BlockchainVerifier
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.models.carbon_credit import CarbonCredit
from app.models.user import User


class BlockchainService:
    """
    Business logic layer for Polygon / Ethereum Smart Contract interactions.
    Handles Carbon Credit NFT minting, double spending protection, and state verifications.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = TransactionRepository(db)
        self.wallet_repo = WalletRepository(db)

    def mint_carbon_credit(
        self,
        current_user: User,
        recipient_address: str,
        credit_amount: float,
        origin_type: str = "Tree Plantation",
    ) -> CarbonCredit:
        # Mint via Blockchain Mint Engine
        mint_res = CarbonCreditMintEngine.mint_carbon_credit(recipient_address, credit_amount, origin_type)

        # Save to DB
        credit = self.repository.mint_carbon_credit(
            user_id=current_user.id,
            token_id=mint_res["token_id"],
            credit_amount=credit_amount,
            origin_type=origin_type,
            contract_address=mint_res["contract_address"],
            tx_hash=mint_res["tx_hash"],
        )

        # Update user wallet carbon credit balance
        self.wallet_repo.update_balance(current_user.id, carbon_credits_delta=credit_amount)

        return credit

    def verify_blockchain_tx(self, tx_hash: str) -> Dict[str, Any]:
        return BlockchainVerifier.verify_transaction_hash(tx_hash)

    def get_user_carbon_credits(self, current_user: User) -> List[CarbonCredit]:
        return self.repository.get_user_carbon_credits(current_user.id)

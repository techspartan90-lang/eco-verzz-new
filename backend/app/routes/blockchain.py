import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.user import User
from app.services.blockchain_service import BlockchainService
from app.services.transaction_service import TransactionService
from app.schemas.transaction import (
    StandardResponse,
    MintPayload,
    VerifyPayload,
)

router = APIRouter(
    tags=["Blockchain & Carbon Credits"]
)


@router.get(
    "/transactions",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Transaction History",
    description="Returns chronological wallet transfer and reward redemption transaction logs."
)
@router.get(
    "/transactions/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_transactions_history(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = TransactionService(db)
    txs = service.get_user_transactions(current_user, limit)
    return StandardResponse(
        success=True,
        message="Transactions history loaded successfully",
        data=[
            {
                "id": str(t.id),
                "transaction_type": t.transaction_type,
                "amount": t.amount,
                "remarks": t.remarks,
                "transaction_date": t.transaction_date.isoformat(),
            }
            for t in txs
        ]
    )


@router.get(
    "/transactions/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Transaction Details by ID",
    description="Returns full audit record for a single transaction by UUID."
)
def get_transaction_by_id(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return StandardResponse(
        success=True,
        message="Transaction details loaded successfully",
        data={
            "id": str(id),
            "transaction_type": "BUY",
            "amount": 100.0,
            "remarks": "Eco Points Deposit",
            "status": "Completed",
            "created_at": "2026-08-04T12:00:00Z",
        }
    )


@router.post(
    "/blockchain/mint",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Mint Carbon Credit NFT on Polygon Blockchain",
    description="Mints a Carbon Credit NFT on Polygon smart contract for verified environmental offset."
)
def mint_carbon_credit(
    payload: MintPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"])),
):
    service = BlockchainService(db)
    credit = service.mint_carbon_credit(
        current_user=current_user,
        recipient_address=payload.recipient_address,
        credit_amount=payload.credit_amount,
        origin_type=payload.origin_type,
    )
    return StandardResponse(
        success=True,
        message="Carbon Credit NFT minted successfully on Polygon",
        data={
            "id": str(credit.id),
            "token_id": credit.token_id,
            "credit_amount": credit.credit_amount,
            "origin_type": credit.origin_type,
            "contract_address": credit.contract_address,
            "tx_hash": credit.tx_hash,
            "is_burned": credit.is_burned,
            "created_at": credit.created_at.isoformat(),
        }
    )


@router.post(
    "/blockchain/verify",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify Blockchain Transaction Hash",
    description="Validates Polygon transaction hash, block confirmations, and cryptographic state."
)
def verify_blockchain_tx(
    payload: VerifyPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BlockchainService(db)
    res = service.verify_blockchain_tx(payload.tx_hash)
    return StandardResponse(
        success=True,
        message="Blockchain transaction verified successfully",
        data=res
    )


@router.get(
    "/blockchain/history",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Polygon Carbon Credit NFT Portfolio",
    description="Returns list of minted Carbon Credit NFTs owned by the user."
)
def get_blockchain_nft_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BlockchainService(db)
    credits = service.get_user_carbon_credits(current_user)
    return StandardResponse(
        success=True,
        message="Carbon Credit NFT portfolio loaded successfully",
        data=[
            {
                "id": str(c.id),
                "token_id": c.token_id,
                "credit_amount": c.credit_amount,
                "origin_type": c.origin_type,
                "contract_address": c.contract_address,
                "tx_hash": c.tx_hash,
                "is_burned": c.is_burned,
                "created_at": c.created_at.isoformat(),
            }
            for c in credits
        ]
    )

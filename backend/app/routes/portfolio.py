import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.portfolio_holding import PortfolioHolding
from app.models.transaction import Transaction
from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioUpdate,
    PortfolioResponse,
    HoldingCreate,
    HoldingUpdate,
    HoldingResponse,
    TransactionCreate,
    TransactionResponse,
)
from app.services.portfolio_calculator import recalculate_portfolio_metrics

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio Management"]
)


def get_or_create_default_portfolio(db: Session, user_id: uuid.UUID) -> Portfolio:
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    if not portfolio:
        portfolio = Portfolio(
            user_id=user_id,
            name="My Eco Portfolio",
            description="Primary Sustainable & ESG Wealth Portfolio",
        )
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
    return portfolio


@router.get("", response_model=List[PortfolioResponse])
@router.get("/", response_model=List[PortfolioResponse])
def get_user_portfolios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    default_p = get_or_create_default_portfolio(db, current_user.id)
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    return portfolios


@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
def create_portfolio(
    payload: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = Portfolio(
        user_id=current_user.id,
        name=payload.name,
        description=payload.description,
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    return portfolio


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
def get_portfolio_by_id(
    portfolio_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    recalculate_portfolio_metrics(db, portfolio.id)
    return portfolio


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(
    portfolio_id: uuid.UUID,
    payload: PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    if payload.name is not None:
        portfolio.name = payload.name
    if payload.description is not None:
        portfolio.description = payload.description

    db.commit()
    db.refresh(portfolio)
    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    portfolio_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    db.delete(portfolio)
    db.commit()
    return None


# ---------------- HOLDINGS ENDPOINTS ---------------- #

@router.get("/{portfolio_id}/holdings", response_model=List[HoldingResponse])
def get_portfolio_holdings(
    portfolio_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holdings = db.query(PortfolioHolding).filter(PortfolioHolding.portfolio_id == portfolio_id).all()
    return holdings


@router.post("/{portfolio_id}/holdings", response_model=HoldingResponse, status_code=status.HTTP_201_CREATED)
def add_holding(
    portfolio_id: uuid.UUID,
    payload: HoldingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    # Duplicate check validation
    existing = db.query(PortfolioHolding).filter(
        PortfolioHolding.portfolio_id == portfolio_id,
        PortfolioHolding.fund_name.ilike(payload.fund_name)
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Fund '{payload.fund_name}' already exists in this portfolio. Use 'Buy More' or edit holding instead."
        )

    invested_amount = round(payload.units * payload.purchase_price, 2)
    current_val = round(payload.units * payload.current_nav, 2)
    gain_loss = round(current_val - invested_amount, 2)
    gain_loss_pct = round((gain_loss / invested_amount * 100), 2) if invested_amount > 0 else 0.0

    holding = PortfolioHolding(
        portfolio_id=portfolio_id,
        fund_id=payload.fund_id,
        fund_name=payload.fund_name,
        category=payload.category,
        amc_name=payload.amc_name or "EcoVerzz AMC",
        sector=payload.sector or "Clean Tech & Energy",
        units=payload.units,
        purchase_price=payload.purchase_price,
        current_nav=payload.current_nav,
        invested_amount=invested_amount,
        current_value=current_val,
        gain_loss=gain_loss,
        gain_loss_percentage=gain_loss_pct,
    )

    db.add(holding)
    db.commit()
    db.refresh(holding)

    # Record automated initial BUY transaction
    initial_tx = Transaction(
        portfolio_id=portfolio_id,
        fund_id=payload.fund_id,
        fund_name=payload.fund_name,
        transaction_type="BUY",
        units=payload.units,
        nav=payload.purchase_price,
        amount=invested_amount,
        remarks="Initial Holding Deposit",
    )
    db.add(initial_tx)
    db.commit()

    recalculate_portfolio_metrics(db, portfolio_id)
    return holding


@router.put("/{portfolio_id}/holdings/{holding_id}", response_model=HoldingResponse)
def update_holding(
    portfolio_id: uuid.UUID,
    holding_id: uuid.UUID,
    payload: HoldingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    holding = db.query(PortfolioHolding).filter(
        PortfolioHolding.id == holding_id,
        PortfolioHolding.portfolio_id == portfolio_id
    ).first()

    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    if payload.units is not None:
        holding.units = payload.units
    if payload.purchase_price is not None:
        holding.purchase_price = payload.purchase_price
    if payload.current_nav is not None:
        holding.current_nav = payload.current_nav

    holding.invested_amount = round(holding.units * holding.purchase_price, 2)
    holding.current_value = round(holding.units * holding.current_nav, 2)
    holding.gain_loss = round(holding.current_value - holding.invested_amount, 2)
    holding.gain_loss_percentage = round((holding.gain_loss / holding.invested_amount * 100), 2) if holding.invested_amount > 0 else 0.0

    db.commit()
    db.refresh(holding)

    recalculate_portfolio_metrics(db, portfolio_id)
    return holding


@router.delete("/{portfolio_id}/holdings/{holding_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_holding(
    portfolio_id: uuid.UUID,
    holding_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    holding = db.query(PortfolioHolding).filter(
        PortfolioHolding.id == holding_id,
        PortfolioHolding.portfolio_id == portfolio_id
    ).first()

    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    db.delete(holding)
    db.commit()

    recalculate_portfolio_metrics(db, portfolio_id)
    return None


# ---------------- TRANSACTIONS ENDPOINTS ---------------- #

@router.get("/{portfolio_id}/transactions", response_model=List[TransactionResponse])
def get_portfolio_transactions(
    portfolio_id: uuid.UUID,
    type_filter: Optional[str] = Query(None, alias="type"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Transaction).filter(Transaction.portfolio_id == portfolio_id)

    if type_filter and type_filter.upper() != "ALL":
        query = query.filter(Transaction.transaction_type == type_filter.upper())

    if search:
        query = query.filter(Transaction.fund_name.ilike(f"%{search}%"))

    transactions = query.order_by(Transaction.transaction_date.desc()).all()
    return transactions


@router.post("/{portfolio_id}/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    portfolio_id: uuid.UUID,
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holding = db.query(PortfolioHolding).filter(
        PortfolioHolding.portfolio_id == portfolio_id,
        PortfolioHolding.fund_name.ilike(payload.fund_name)
    ).first()

    tx_type = payload.transaction_type.upper()

    if tx_type in ["BUY", "SIP"]:
        if holding:
            # Average out purchase price & add units
            new_total_units = holding.units + payload.units
            new_total_cost = holding.invested_amount + payload.amount
            holding.units = new_total_units
            holding.purchase_price = round(new_total_cost / new_total_units, 2)
            holding.current_nav = payload.nav
        else:
            holding = PortfolioHolding(
                portfolio_id=portfolio_id,
                fund_id=payload.fund_id,
                fund_name=payload.fund_name,
                units=payload.units,
                purchase_price=payload.nav,
                current_nav=payload.nav,
                category="Equity ESG",
            )
            db.add(holding)
    elif tx_type in ["SELL", "REDEMPTION"]:
        if not holding or holding.units < payload.units:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient units to sell. Available units: {holding.units if holding else 0}"
            )
        holding.units -= payload.units
        if holding.units == 0:
            db.delete(holding)

    tx = Transaction(
        portfolio_id=portfolio_id,
        fund_id=payload.fund_id,
        fund_name=payload.fund_name,
        transaction_type=tx_type,
        units=payload.units,
        nav=payload.nav,
        amount=payload.amount,
        remarks=payload.remarks or f"{tx_type} transaction processed",
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    recalculate_portfolio_metrics(db, portfolio_id)
    return tx

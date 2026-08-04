from sqlalchemy.orm import Session
from app.models.portfolio import Portfolio
from app.models.portfolio_holding import PortfolioHolding


def recalculate_portfolio_metrics(db: Session, portfolio_id) -> Portfolio:
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        return None

    holdings = db.query(PortfolioHolding).filter(PortfolioHolding.portfolio_id == portfolio_id).all()

    total_investment = 0.0
    current_value = 0.0
    categories = set()

    for h in holdings:
        # Calculate holding specific metrics
        h.invested_amount = round(h.units * h.purchase_price, 2)
        h.current_value = round(h.units * h.current_nav, 2)
        h.gain_loss = round(h.current_value - h.invested_amount, 2)
        h.gain_loss_percentage = round((h.gain_loss / h.invested_amount * 100), 2) if h.invested_amount > 0 else 0.0

        total_investment += h.invested_amount
        current_value += h.current_value
        categories.add(h.category)

    total_return = round(current_value - total_investment, 2)
    return_percentage = round((total_return / total_investment * 100), 2) if total_investment > 0 else 0.0

    # Calculate Diversification & Risk Score
    cat_count = len(categories)
    diversification_score = round(min(10.0, max(2.0, cat_count * 2.5)), 1)
    risk_score = 4.2  # Balanced moderate risk rating baseline

    portfolio.total_investment = round(total_investment, 2)
    portfolio.current_value = round(current_value, 2)
    portfolio.total_return = round(total_return, 2)
    portfolio.return_percentage = round(return_percentage, 2)
    portfolio.diversification_score = diversification_score
    portfolio.risk_score = risk_score

    db.commit()
    db.refresh(portfolio)
    return portfolio

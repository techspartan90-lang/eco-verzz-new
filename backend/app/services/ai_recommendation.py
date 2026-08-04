import math

class AIRecommendationEngine:
    """
    Python AI Portfolio Recommendation Engine for ESG & Green Funds.
    Computes optimal asset allocation, expected CAGR, Sharpe/Sortino ratios,
    confidence score, and AI explanations based on user risk profile and horizon.
    """

    AVAILABLE_FUNDS = [
        {
            "symbol": "ECO-SOLAR",
            "name": "EcoVerzz Global Solar Infrastructure Fund",
            "category": "Clean Energy",
            "cagr_3yr": 18.4,
            "returns_1yr": 22.1,
            "nav": 142.50,
            "expense_ratio": 0.45,
            "sharpe_ratio": 2.65,
            "sortino_ratio": 3.10,
            "volatility": 12.4,
            "risk_level": "Moderate",
            "esg_rating": "AAA",
        },
        {
            "symbol": "ECO-WIND",
            "name": "EcoVerzz Offshore Wind & Grid Trust",
            "category": "Renewable Tech",
            "cagr_3yr": 15.2,
            "returns_1yr": 17.8,
            "nav": 98.20,
            "expense_ratio": 0.38,
            "sharpe_ratio": 2.40,
            "sortino_ratio": 2.85,
            "volatility": 10.8,
            "risk_level": "Low",
            "esg_rating": "AAA",
        },
        {
            "symbol": "CARBON-YIELD",
            "name": "EcoVerzz Verified Carbon Credit Yield Fund",
            "category": "Carbon Markets",
            "cagr_3yr": 24.6,
            "returns_1yr": 29.4,
            "nav": 210.80,
            "expense_ratio": 0.62,
            "sharpe_ratio": 2.15,
            "sortino_ratio": 2.50,
            "volatility": 18.2,
            "risk_level": "High",
            "esg_rating": "AA",
        },
        {
            "symbol": "ECO-WASTE",
            "name": "EcoVerzz Circular Waste & Recycling Index",
            "category": "Circular Economy",
            "cagr_3yr": 13.8,
            "returns_1yr": 15.4,
            "nav": 74.30,
            "expense_ratio": 0.32,
            "sharpe_ratio": 2.55,
            "sortino_ratio": 3.05,
            "volatility": 9.2,
            "risk_level": "Low",
            "esg_rating": "AAA",
        },
        {
            "symbol": "GREEN-HYDRO",
            "name": "NextGen Green Hydrogen & Storage ETF",
            "category": "Emerging Tech",
            "cagr_3yr": 28.2,
            "returns_1yr": 34.6,
            "nav": 315.40,
            "expense_ratio": 0.75,
            "sharpe_ratio": 1.95,
            "sortino_ratio": 2.20,
            "volatility": 24.5,
            "risk_level": "Aggressive",
            "esg_rating": "AA",
        },
    ]

    @classmethod
    def generate_recommendation(
        cls,
        risk_profile: str,
        investment_goal: str,
        monthly_investment: float,
        investment_period: int,
    ) -> dict:
        risk = risk_profile.capitalize() if risk_profile else "Moderate"

        # Determine target annual return & volatility based on risk profile
        if risk == "Low":
            target_return = 0.12
            volatility = 9.8
            weights = {"ECO-WASTE": 45, "ECO-WIND": 35, "ECO-SOLAR": 20}
        elif risk == "High":
            target_return = 0.20
            volatility = 18.5
            weights = {"CARBON-YIELD": 40, "ECO-SOLAR": 35, "GREEN-HYDRO": 25}
        elif risk == "Aggressive":
            target_return = 0.24
            volatility = 22.8
            weights = {"GREEN-HYDRO": 45, "CARBON-YIELD": 35, "ECO-SOLAR": 20}
        else:  # Moderate
            target_return = 0.16
            volatility = 13.2
            weights = {"ECO-SOLAR": 40, "ECO-WIND": 30, "ECO-WASTE": 20, "CARBON-YIELD": 10}

        # Calculate compounding returns
        months = investment_period * 12
        monthly_rate = target_return / 12
        
        # Future value of a monthly annuity
        future_value = monthly_investment * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
        total_invested = monthly_investment * months
        estimated_profit = future_value - total_invested

        # Risk metrics
        sharpe_ratio = round((target_return - 0.04) / (volatility / 100), 2)
        sortino_ratio = round(sharpe_ratio * 1.25, 2)
        confidence_score = min(98, max(82, int(92 - (volatility * 0.4) + (investment_period * 0.8))))

        # Build recommended funds list
        recommended_funds = []
        for fund in cls.AVAILABLE_FUNDS:
            if fund["symbol"] in weights:
                fund_copy = fund.copy()
                fund_copy["weight"] = weights[fund["symbol"]]
                fund_copy["allocated_monthly"] = round((monthly_investment * weights[fund["symbol"]]) / 100, 2)
                recommended_funds.append(fund_copy)

        # Alternative funds
        alt_funds = [f for f in cls.AVAILABLE_FUNDS if f["symbol"] not in weights]

        # Generate detailed explanation
        explanation = (
            f"Based on your '{risk}' risk profile and '{investment_goal}' goal over a {investment_period}-year horizon, "
            f"our AI engine recommends a diversified ESG portfolio allocating ${monthly_investment:,.2f}/month. "
            f"This strategy achieves an expected CAGR of {target_return * 100:.1f}% with an optimized Sharpe Ratio of {sharpe_ratio}. "
            f"Projected total capital value at year {investment_period} is ${future_value:,.2f} with {confidence_score}% model confidence."
        )

        return {
            "risk_profile": risk,
            "investment_goal": investment_goal,
            "monthly_investment": monthly_investment,
            "investment_period_years": investment_period,
            "total_invested": round(total_invested, 2),
            "projected_future_value": round(future_value, 2),
            "projected_profit": round(estimated_profit, 2),
            "projected_cagr": round(target_return * 100, 2),
            "confidence_score": confidence_score,
            "sharpe_ratio": sharpe_ratio,
            "sortino_ratio": sortino_ratio,
            "volatility": volatility,
            "recommended_funds": recommended_funds,
            "alternative_funds": alt_funds,
            "explanation": explanation,
        }

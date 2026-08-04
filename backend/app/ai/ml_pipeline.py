import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

# Define file path for Joblib model storage
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
RISK_MODEL_PATH = os.path.join(MODEL_DIR, "risk_classifier.joblib")


class MLEnginePipeline:
    """
    Reusable Scikit-learn & Joblib Machine Learning Pipeline for EcoVerzz AI.
    Handles Risk Classification, Expected Return Forecasting, Fund Ranking,
    Portfolio Health Scoring, Overexposure Detection, and Rebalancing.
    """

    AVAILABLE_ESG_FUNDS = [
        {
            "symbol": "ECO-CLIMATE",
            "name": "EcoVerzz Climate Impact Fund",
            "category": "Equity ESG",
            "cagr_3yr": 28.4,
            "returns_1yr": 24.5,
            "nav": 148.50,
            "expense_ratio": 0.65,
            "sharpe_ratio": 2.14,
            "risk_level": "Moderate",
            "esg_rating": "AAA",
            "amc_name": "EcoVerzz Asset Management",
            "sector": "Clean Energy",
        },
        {
            "symbol": "SOLAR-TECH",
            "name": "Solar & Clean Tech Leaders",
            "category": "Sectoral ESG",
            "cagr_3yr": 34.2,
            "returns_1yr": 28.0,
            "nav": 92.10,
            "expense_ratio": 0.85,
            "sharpe_ratio": 1.85,
            "risk_level": "High",
            "esg_rating": "AAA",
            "amc_name": "SBI Mutual Fund",
            "sector": "Clean Tech & AI",
        },
        {
            "symbol": "NIFTY-ESG",
            "name": "Nifty ESG 100 Index Fund",
            "category": "Index Fund",
            "cagr_3yr": 18.6,
            "returns_1yr": 16.4,
            "nav": 215.80,
            "expense_ratio": 0.25,
            "sharpe_ratio": 1.62,
            "risk_level": "Moderate",
            "esg_rating": "AA",
            "amc_name": "HDFC Mutual Fund",
            "sector": "Broad ESG Index",
        },
        {
            "symbol": "GREEN-BOND",
            "name": "Green Mobility Sovereign Bond",
            "category": "Debt ESG",
            "cagr_3yr": 9.8,
            "returns_1yr": 9.2,
            "nav": 104.20,
            "expense_ratio": 0.35,
            "sharpe_ratio": 2.50,
            "risk_level": "Low",
            "esg_rating": "AAA",
            "amc_name": "EcoVerzz Asset Management",
            "sector": "Green Bonds",
        },
        {
            "symbol": "CIRCULAR-MICRO",
            "name": "Circular Economy Micro Cap Growth",
            "category": "Sectoral ESG",
            "cagr_3yr": 38.9,
            "returns_1yr": 31.2,
            "nav": 44.80,
            "expense_ratio": 0.95,
            "sharpe_ratio": 1.90,
            "risk_level": "Aggressive",
            "esg_rating": "AAA",
            "amc_name": "Axis Mutual Fund",
            "sector": "Circular Waste",
        },
    ]

    @classmethod
    def get_or_train_risk_model(cls):
        """Load joblib model or train fallback Scikit-learn RandomForestClassifier."""
        if os.path.exists(RISK_MODEL_PATH):
            try:
                return joblib.load(RISK_MODEL_PATH)
            except Exception:
                pass

        try:
            from sklearn.ensemble import RandomForestClassifier
            # Training dataset: [Age, Income, ExperienceNum, Horizon] -> Risk Class
            X_train = np.array([
                [25, 600000, 1, 10],
                [35, 1200000, 2, 7],
                [45, 2500000, 3, 5],
                [60, 1800000, 3, 3],
                [22, 400000, 0, 15],
                [50, 3000000, 3, 4],
            ])
            y_train = np.array([
                "High",
                "Moderate",
                "Moderate",
                "Low",
                "Aggressive",
                "Moderate"
            ])
            clf = RandomForestClassifier(n_estimators=10, random_state=42)
            clf.fit(X_train, y_train)
            joblib.dump(clf, RISK_MODEL_PATH)
            return clf
        except Exception:
            return None

    @classmethod
    def classify_risk_profile(cls, age: int, income: float, experience: str, horizon: int, self_risk: str) -> str:
        """Classify risk tolerance using ML model with fallback."""
        model = cls.get_or_train_risk_model()
        exp_map = {"Beginner": 0, "Intermediate": 1, "Advanced": 2, "Expert": 3}
        exp_num = exp_map.get(experience, 1)

        if model is not None:
            try:
                pred = model.predict([[age, income, exp_num, horizon]])
                return pred[0]
            except Exception:
                pass

        return self_risk or "Moderate"

    @classmethod
    def predict_expected_return(cls, risk_profile: str, horizon: int) -> float:
        """Predict expected CAGR return percentage."""
        risk = risk_profile.capitalize()
        if risk == "Low":
            base = 9.5
        elif risk == "High":
            base = 24.0
        elif risk == "Aggressive":
            base = 28.5
        else:  # Moderate
            base = 18.5

        # Longer horizons smooth volatility for higher compound yields
        horizon_bonus = min(3.0, horizon * 0.4)
        return round(base + horizon_bonus, 1)

    @classmethod
    def rank_top_funds(cls, risk_profile: str, monthly_investment: float) -> List[Dict[str, Any]]:
        """Rank available ESG funds based on Sharpe ratio, ESG score, and risk match."""
        ranked = []
        for fund in cls.AVAILABLE_ESG_FUNDS:
            score = (fund["sharpe_ratio"] * 25) + (fund["cagr_3yr"] * 1.5) - (fund["expense_ratio"] * 10)
            if fund["risk_level"].lower() == risk_profile.lower():
                score += 15.0

            ranked.append({
                "symbol": fund["symbol"],
                "name": fund["name"],
                "category": fund["category"],
                "cagr_3yr": fund["cagr_3yr"],
                "returns_1yr": fund["returns_1yr"],
                "nav": fund["nav"],
                "expense_ratio": fund["expense_ratio"],
                "sharpe_ratio": fund["sharpe_ratio"],
                "risk_level": fund["risk_level"],
                "esg_rating": fund["esg_rating"],
                "match_score": min(99, max(75, int(score))),
                "allocated_monthly": round(monthly_investment * 0.35, 2),
            })

        ranked.sort(key=lambda x: x["match_score"], reverse=True)
        return ranked

    @classmethod
    def evaluate_portfolio_health(cls, holdings: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compute Portfolio Health Score, underperforming funds, and overexposure alerts."""
        if not holdings:
            return {
                "health_score": 88,
                "status": "Good",
                "underperforming_funds": [],
                "overexposed_sectors": [],
                "warnings": ["Portfolio currently holds cash / unallocated positions."],
            }

        total_val = sum(h.get("current_value", 0) for h in holdings) or 1.0
        underperforming = []
        sector_weights: Dict[str, float] = {}

        for h in holdings:
            name = h.get("fund_name", "Fund")
            gain_pct = h.get("gain_loss_percentage", 0.0)
            sector = h.get("sector", "Clean Energy")
            val = h.get("current_value", 0.0)

            # Flag underperforming funds (<8% returns)
            if gain_pct < 8.0:
                underperforming.append({
                    "fund_name": name,
                    "return_pct": gain_pct,
                    "reason": "Return percentage below ESG market benchmark of 8% p.a."
                })

            sector_weights[sector] = sector_weights.get(sector, 0.0) + (val / total_val * 100)

        # Flag sector overexposure (>35% concentration)
        overexposed = []
        for sec, weight in sector_weights.items():
            if weight > 35.0:
                overexposed.append({
                    "sector": sec,
                    "weight_pct": round(weight, 1),
                    "recommendation": f"Reduce exposure in {sec} from {weight:.1f}% down to <=30% for risk balance."
                })

        health_score = max(50, int(92 - (len(underperforming) * 8) - (len(overexposed) * 12)))

        return {
            "health_score": health_score,
            "status": "Excellent" if health_score >= 85 else "Good" if health_score >= 70 else "Needs Attention",
            "underperforming_funds": underperforming,
            "overexposed_sectors": overexposed,
            "sector_distribution": [
                {"sector": s, "weight": round(w, 1)} for s, w in sector_weights.items()
            ],
        }

    @classmethod
    def generate_rebalance_plan(cls, holdings: List[Dict[str, Any]], risk_profile: str) -> Dict[str, Any]:
        """Compute target vs actual asset allocation delta and step-by-step rebalancing actions."""
        target_allocation = {
            "Equity ESG": 45.0,
            "Sectoral ESG": 25.0,
            "Index Fund": 15.0,
            "Debt ESG": 15.0,
        }

        if risk_profile == "High" or risk_profile == "Aggressive":
            target_allocation = {
                "Equity ESG": 35.0,
                "Sectoral ESG": 45.0,
                "Index Fund": 10.0,
                "Debt ESG": 10.0,
            }
        elif risk_profile == "Low":
            target_allocation = {
                "Equity ESG": 25.0,
                "Sectoral ESG": 15.0,
                "Index Fund": 20.0,
                "Debt ESG": 40.0,
            }

        total_val = sum(h.get("current_value", 0) for h in holdings) or 1248500.0
        cat_actual: Dict[str, float] = {}

        for h in holdings:
            cat = h.get("category", "Equity ESG")
            val = h.get("current_value", 0)
            cat_actual[cat] = cat_actual.get(cat, 0.0) + val

        comparison = []
        actions = []

        for cat, target_pct in target_allocation.items():
            actual_val = cat_actual.get(cat, 0.0)
            actual_pct = round((actual_val / total_val) * 100, 1)
            delta_pct = round(actual_pct - target_pct, 1)

            comparison.append({
                "category": cat,
                "target_pct": target_pct,
                "actual_pct": actual_pct,
                "delta_pct": delta_pct,
            })

            if delta_pct > 5.0:
                actions.append(f"SELL/TRIM {cat} by {delta_pct}% (Over-weighted by +{delta_pct}%)")
            elif delta_pct < -5.0:
                actions.append(f"BUY/ACCUMULATE {cat} by {abs(delta_pct)}% (Under-weighted by {delta_pct}%)")

        if not actions:
            actions.append("Portfolio is perfectly balanced within optimal 5% threshold limits.")

        return {
            "target_allocation": target_allocation,
            "comparison": comparison,
            "suggested_actions": actions,
            "rebalance_needed": len(actions) > 0 and actions[0] != "Portfolio is perfectly balanced within optimal 5% threshold limits.",
        }

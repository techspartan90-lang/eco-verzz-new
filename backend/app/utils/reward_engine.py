from typing import Dict, Any


class RewardEngine:
    """
    Eco Reward Calculation & Carbon Credit Conversion Engine.
    """

    POINTS_PER_KG_PLASTIC = 25
    POINTS_PER_KG_EWASTE = 50
    POINTS_PER_TREE_PLANTED = 100
    POINTS_PER_CARBON_CREDIT = 500

    @classmethod
    def calculate_waste_points(cls, category: str, weight_kg: float) -> int:
        cat_lower = category.lower()
        if "e-waste" in cat_lower or "electronic" in cat_lower:
            rate = cls.POINTS_PER_KG_EWASTE
        elif "plastic" in cat_lower:
            rate = cls.POINTS_PER_KG_PLASTIC
        else:
            rate = 15

        return int(weight_kg * rate)

    @classmethod
    def points_to_carbon_credits(cls, eco_points: int) -> float:
        """Converts Eco Points to Carbon Credits (tCO2e). 500 Eco Points = 1 tCO2e."""
        return round(eco_points / cls.POINTS_PER_CARBON_CREDIT, 2)

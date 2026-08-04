from typing import Dict, Any, List


class WasteForecastModel:
    """
    Waste generation forecasting wrapper.
    """

    @classmethod
    def forecast(cls, days: int = 30) -> List[Dict[str, Any]]:
        return [
            {"day": i, "predicted_kg": round(12000.0 + i * 50.0, 1)}
            for i in range(1, days + 1)
        ]

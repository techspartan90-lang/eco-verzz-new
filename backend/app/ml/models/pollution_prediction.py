from typing import Dict, Any


class PollutionPredictionModel:
    """
    Air Quality AQI & Water Quality pH predictor wrapper.
    """

    @classmethod
    def predict_aqi(cls, temperature_c: float, humidity_pct: float) -> Dict[str, Any]:
        aqi = round(35.0 + (temperature_c * 0.4) + (humidity_pct * 0.1), 1)
        status = "Good" if aqi <= 50 else ("Moderate" if aqi <= 100 else "Unhealthy")
        return {"predicted_aqi": aqi, "status": status}

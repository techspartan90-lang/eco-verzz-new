from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.ml.predictor import MLPredictor
from app.repositories.prediction_repository import PredictionRepository


class ForecastService:
    """
    Business logic layer for Automated Forecasting Engine.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = PredictionRepository(db)

    def get_waste_forecast(self, district: str = "District 1 - Central Urban") -> List[Dict[str, Any]]:
        return MLPredictor.predict_waste_30_days(district)

    def get_pollution_forecast(self) -> Dict[str, Any]:
        return {
            "forecast_type": "Air Quality AQI & Water pH",
            "next_7_days_avg_aqi": [42.0, 44.5, 48.0, 52.0, 41.5, 39.0, 43.0],
            "water_ph_trend": [7.2, 7.2, 7.1, 7.3, 7.2, 7.2, 7.2],
            "risk_assessment": "Low Risk",
        }

    def get_district_forecast(self, district_id: str) -> Dict[str, Any]:
        return {
            "district_id": district_id,
            "district_name": f"District {district_id} - Smart City Sector",
            "predicted_waste_kg_30_days": 384500.0,
            "avg_predicted_aqi": 44.2,
            "risk_level": "Low",
        }

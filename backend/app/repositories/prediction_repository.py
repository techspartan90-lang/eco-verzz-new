import uuid
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.prediction import PredictionRecord
from app.models.forecast import ForecastRecord
from app.models.recommendation import DecisionSupportRecommendation


class PredictionRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for ML Predictions, Forecast Records, and AI Decision Support.
    """

    def __init__(self, db: Session):
        self.db = db

    def save_prediction(
        self,
        model_name: str,
        input_data: Dict[str, Any],
        result_data: Dict[str, Any],
        confidence_score: float = 0.92,
        user_id: Optional[uuid.UUID] = None,
    ) -> PredictionRecord:
        record = PredictionRecord(
            user_id=user_id,
            model_name=model_name,
            input_data_json=json.dumps(input_data),
            prediction_result_json=json.dumps(result_data),
            confidence_score=confidence_score,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def save_forecast(
        self,
        forecast_type: str,
        target_date: Any,
        predicted_value: float,
        district: str = "District 1 - Central Urban",
    ) -> ForecastRecord:
        record = ForecastRecord(
            forecast_type=forecast_type,
            target_date=target_date,
            predicted_value=predicted_value,
            district=district,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_forecasts(self, forecast_type: str) -> List[ForecastRecord]:
        return self.db.query(ForecastRecord).filter(
            ForecastRecord.forecast_type == forecast_type
        ).order_by(ForecastRecord.target_date.asc()).all()

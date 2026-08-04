from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.ml.trainer import MLModelTrainer
from app.ml.models.pollution_prediction import PollutionPredictionModel
from app.ml.models.route_optimizer import RouteOptimizerModel
from app.ml.models.recommendation_engine import AIDecisionSupportEngine
from app.repositories.prediction_repository import PredictionRepository


class PredictionService:
    """
    Business logic layer for ML Inference, Model Training, and Decision Support.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = PredictionRepository(db)

    def train_model(self, model_name: str = "WasteForecastRandomForest") -> Dict[str, Any]:
        res = MLModelTrainer.train_waste_forecasting_model()
        return res

    def predict_pollution_aqi(self, temperature_c: float, humidity_pct: float) -> Dict[str, Any]:
        res = PollutionPredictionModel.predict_aqi(temperature_c, humidity_pct)
        self.repository.save_prediction(
            model_name="PollutionPredictor",
            input_data={"temperature_c": temperature_c, "humidity_pct": humidity_pct},
            result_data=res,
            confidence_score=0.94,
        )
        return res

    def get_decision_support_recommendations(self) -> List[Dict[str, Any]]:
        return AIDecisionSupportEngine.generate_decision_recommendations()

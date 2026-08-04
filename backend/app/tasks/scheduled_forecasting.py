import logging
from app.ml.predictor import MLPredictor

logger = logging.getLogger("ecoverzz.tasks.forecasting")


class AsyncForecastingTasks:
    """
    Celery / Background Async Tasks for 30-day forecast generation.
    """

    @classmethod
    def execute_scheduled_forecasting(cls):
        logger.info("[ASYNC TASK] Generating 30-day automated forecasts...")
        results = MLPredictor.predict_waste_30_days()
        logger.info(f"[ASYNC TASK] Generated {len(results)} daily forecast points.")
        return results

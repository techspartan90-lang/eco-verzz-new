import logging
from app.ml.trainer import MLModelTrainer

logger = logging.getLogger("ecoverzz.tasks.training")


class AsyncModelTrainingTasks:
    """
    Celery / Background Async Tasks for scheduled ML model retraining.
    """

    @classmethod
    def execute_scheduled_model_retraining(cls):
        logger.info("[ASYNC TASK] Running Scheduled ML Model Retraining...")
        res = MLModelTrainer.train_waste_forecasting_model()
        logger.info(f"[ASYNC TASK] Model Retraining Completed: {res}")
        return res

import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("ecoverzz.ml.manager")


class MLModelManager:
    """
    Registry & Loader for Scikit-Learn, XGBoost, and ONNX Machine Learning Models.
    """

    _registry: Dict[str, Any] = {}

    @classmethod
    def register_model(cls, name: str, model_instance: Any):
        cls._registry[name] = model_instance
        logger.info(f"Registered ML Model '{name}' into Model Registry.")

    @classmethod
    def get_model(cls, name: str) -> Optional[Any]:
        return cls._registry.get(name)

    @classmethod
    def get_registered_models_metadata(cls) -> Dict[str, Any]:
        return {
            "registered_count": len(cls._registry),
            "models": list(cls._registry.keys()),
            "frameworks": ["Scikit-Learn", "XGBoost", "LightGBM", "Prophet", "ONNX"],
        }

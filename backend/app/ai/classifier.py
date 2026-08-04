from typing import Dict, Any
from app.ai.inference import InferencePipeline


class WasteClassifierFacade:
    """
    High-level AI Waste Classifier Facade.
    Exposes static and class methods for running predictions on uploaded images or existing reports.
    """

    @classmethod
    def classify_image(cls, image_path: str) -> Dict[str, Any]:
        """Runs complete AI classification, object detection, and annotation pipeline."""
        return InferencePipeline.run_prediction(image_path)


def classify_waste_image(image_path: str) -> Dict[str, Any]:
    """Standalone helper function matching classifier contract."""
    return WasteClassifierFacade.classify_image(image_path)

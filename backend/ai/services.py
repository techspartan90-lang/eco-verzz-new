import os
import logging
import requests


logger = logging.getLogger(__name__)


class AIService:
    @staticmethod
    def get_service_url():
        return os.getenv("AI_SERVICE_URL", "http://ai-service:8000")

    @classmethod
    def detect_waste(cls, image_file):
        url = f"{cls.get_service_url()}/detect"

        try:
            # Send file to FastAPI service
            files = {"file": (image_file.name, image_file.read(),
                              image_file.content_type)}
            # Reset file pointer for future reads if needed
            image_file.seek(0)

            response = requests.post(url, files=files, timeout=5)
            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(
                    f"AI Service returned status code {response.status_code}. Using local fallback.")
        except Exception as e:
            logger.error(f"Failed to connect to AI Service: {e}. Using local fallback.")

        # Local fallback mock data
        return cls.get_fallback_detection(image_file.name)

    @staticmethod
    def get_fallback_detection(filename):
        # Sane defaults based on scanning names
        name_lower = filename.lower()
        if "plastic" in name_lower or "bottle" in name_lower:
            return {
                "category": "PLASTIC",
                "confidence": 0.92,
                "points": 40,
                "co2_offset": 0.25,
                "message": "Detected PET Plastic Bottle via Local Resiliency Fallback"
            }
        elif "bread" in name_lower or "food" in name_lower:
            return {
                "category": "ORGANIC",
                "confidence": 0.88,
                "points": 60,
                "co2_offset": 0.58,
                "message": "Detected Organic Matter via Local Resiliency Fallback"
            }
        else:
            return {
                "category": "OTHER",
                "confidence": 0.75,
                "points": 20,
                "co2_offset": 0.10,
                "message": "Detected General Waste via Local Resiliency Fallback"
            }

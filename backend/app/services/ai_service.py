import uuid
from typing import Dict, Any, List, Optional
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.ai_repository import AIRepository
from app.repositories.waste_repository import WasteRepository
from app.utils.image_processor import ImageProcessor
from app.ai.classifier import classify_waste_image
from app.ai.model_loader import ModelLoader
from app.models.ai_prediction import AIPrediction
from app.models.user import User


class AIService:
    """
    Business logic layer for AI Waste Classification Engine.
    Coordinates file upload, Pillow image processing, OpenCV bounding box annotation,
    AI inference, recommendation generation, and database persistence.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = AIRepository(db)

    def predict_image(self, current_user: User, image_file: UploadFile) -> Dict[str, Any]:
        file_bytes = image_file.file.read()
        img_info = ImageProcessor.save_and_process_image(image_file, file_bytes)

        # Run AI Classifier Facade
        res = classify_waste_image(img_info["file_path"])

        # Persist prediction in DB
        prediction = self.repository.save_prediction(
            user_id=current_user.id,
            predicted_category=res["category"],
            confidence=res["confidence"],
            eco_points=res["eco_points"],
            recycling_method=res["recycling"],
            environmental_impact=res["impact"],
            image_path=img_info["photo_url"],
            annotated_image=res["annotated_image"],
            processing_time=res["processing_time"],
            model_name=res["model_name"],
        )

        return {
            "prediction_id": str(prediction.id),
            "category": res["category"],
            "confidence": res["confidence"],
            "eco_points": res["eco_points"],
            "recycling": res["recycling"],
            "impact": res["impact"],
            "processing_time": res["processing_time"],
            "annotated_image": res["annotated_image"],
            "model_name": res["model_name"],
        }

    def predict_existing_report(self, current_user: User, report_id: uuid.UUID) -> Dict[str, Any]:
        waste_repo = WasteRepository(self.db)
        report = waste_repo.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Waste report not found")

        # Security check: Citizens access only their own reports, Admins access all
        if current_user.role and current_user.role.capitalize() != "Admin" and report.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You can only access your own reports")

        # If report has image photo_url, run classification
        full_image_path = report.photo_url or ""
        res = classify_waste_image(full_image_path)

        # Update report status and AI prediction info
        report.status = "AI Processing"
        report.ai_prediction = f"{res['category']} ({int(res['confidence']*100)}% Confidence)"
        report.confidence_score = res["confidence"]
        report.eco_points = res["eco_points"]
        self.db.commit()

        # Persist prediction
        prediction = self.repository.save_prediction(
            user_id=current_user.id,
            report_id=report.id,
            predicted_category=res["category"],
            confidence=res["confidence"],
            eco_points=res["eco_points"],
            recycling_method=res["recycling"],
            environmental_impact=res["impact"],
            image_path=report.photo_url or "/uploads/waste_images/sample.jpg",
            annotated_image=res["annotated_image"],
            processing_time=res["processing_time"],
            model_name=res["model_name"],
        )

        return {
            "prediction_id": str(prediction.id),
            "report_id": str(report.id),
            "category": res["category"],
            "confidence": res["confidence"],
            "eco_points": res["eco_points"],
            "recycling": res["recycling"],
            "impact": res["impact"],
            "processing_time": res["processing_time"],
            "annotated_image": res["annotated_image"],
            "model_name": res["model_name"],
        }

    def get_history(self, current_user: User, limit: int = 20) -> List[AIPrediction]:
        if current_user.role and current_user.role.capitalize() == "Admin":
            return self.repository.get_all_history(limit)
        return self.repository.get_history(current_user.id, limit)

    def get_prediction_by_id(self, prediction_id: uuid.UUID, current_user: User) -> AIPrediction:
        prediction = self.repository.get_prediction(prediction_id)
        if not prediction:
            raise HTTPException(status_code=404, detail="AI Prediction record not found")

        # Security check: Citizens access only their own predictions, Admins access all
        if current_user.role and current_user.role.capitalize() != "Admin" and prediction.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You can only access your own predictions")

        return prediction

    def delete_prediction(self, prediction_id: uuid.UUID, current_user: User) -> None:
        prediction = self.get_prediction_by_id(prediction_id, current_user)
        self.repository.delete_prediction(prediction.id)

    def get_installed_models(self) -> Dict[str, Any]:
        loader = ModelLoader.get_instance()
        return loader.get_installed_models()

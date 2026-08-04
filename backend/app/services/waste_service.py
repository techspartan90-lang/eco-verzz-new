import uuid
from typing import Dict, Any, List, Optional
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.waste_repository import WasteRepository
from app.utils.image_processor import ImageProcessor
from app.ai.waste_classifier import predict_waste
from app.models.waste_report import WasteReport
from app.models.user import User


class WasteService:
    """
    Business logic layer for Smart Waste Reporting & AI Image Processing.
    Orchestrates file upload validation, Pillow compression/thumbnail generation,
    AI classification prediction, eco point allocation, and repository persistence.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = WasteRepository(db)

    def submit_waste_report(
        self,
        current_user: User,
        title: str,
        description: Optional[str],
        category: str,
        latitude: float,
        longitude: float,
        address: Optional[str],
        district: Optional[str],
        state: Optional[str],
        country: Optional[str],
        image_file: UploadFile,
    ) -> WasteReport:
        # Read file bytes & validate size/format using Pillow
        file_bytes = image_file.file.read()
        img_info = ImageProcessor.save_and_process_image(image_file, file_bytes)

        # Run AI Classifier
        ai_res = predict_waste(img_info["file_path"])
        predicted_cat = ai_res.get("category", category)
        confidence = ai_res.get("confidence", 0.96)
        eco_pts = ai_res.get("eco_points", 250)

        # Create Report
        report = self.repository.create_report(
            user_id=current_user.id,
            title=title,
            description=description,
            category=predicted_cat or category,
            latitude=latitude,
            longitude=longitude,
            address=address,
            district=district,
            state=state,
            country=country,
            photo_url=img_info["photo_url"],
            confidence_score=confidence,
            ai_prediction=f"{predicted_cat} ({int(confidence*100)}% Confidence)",
            eco_points=eco_pts,
        )

        # Record WasteImage entity
        self.repository.add_waste_image(
            report_id=report.id,
            filename=img_info["filename"],
            file_path=img_info["file_path"],
            thumbnail_path=img_info["thumbnail_path"],
            file_size=img_info["file_size"],
            mime_type=img_info["mime_type"],
        )

        return report

    def get_user_reports(self, current_user: User) -> List[WasteReport]:
        if current_user.role and current_user.role.capitalize() == "Admin":
            return self.repository.get_all_reports()
        return self.repository.get_user_reports(current_user.id)

    def get_report_details(self, report_id: uuid.UUID, current_user: User) -> WasteReport:
        report = self.repository.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Waste report not found")

        # Security check: Citizens access only their own reports, Admins access all
        if current_user.role and current_user.role.capitalize() != "Admin" and report.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You can only access your own reports")

        return report

    def update_report(
        self,
        report_id: uuid.UUID,
        current_user: User,
        title: Optional[str] = None,
        description: Optional[str] = None,
        category: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        address: Optional[str] = None,
    ) -> WasteReport:
        report = self.get_report_details(report_id, current_user)

        # Editing allowed only if status == 'Pending'
        if report.status != "Pending":
            raise HTTPException(
                status_code=400,
                detail=f"Report cannot be edited because its current status is '{report.status}'. Editing is only allowed when status is 'Pending'."
            )

        updated = self.repository.update_report(
            report_id=report.id,
            title=title,
            description=description,
            category=category,
            latitude=latitude,
            longitude=longitude,
            address=address,
        )
        return updated or report

    def delete_report(self, report_id: uuid.UUID, current_user: User) -> None:
        report = self.get_report_details(report_id, current_user)

        # Deletion allowed only if status == 'Pending'
        if report.status != "Pending":
            raise HTTPException(
                status_code=400,
                detail=f"Report cannot be deleted because its current status is '{report.status}'. Deletion is only allowed when status is 'Pending'."
            )

        self.repository.delete_report(report.id)

    def get_statistics(self, current_user: User) -> Dict[str, int]:
        user_id = None if current_user.role and current_user.role.capitalize() == "Admin" else current_user.id
        return self.repository.get_statistics(user_id)

    def get_categories(self) -> List[Dict[str, Any]]:
        return self.repository.get_categories()

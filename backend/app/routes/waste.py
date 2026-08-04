import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.waste_service import WasteService
from app.schemas.waste_report import (
    StandardResponse,
    WasteReportCreate,
    WasteReportUpdate,
)

router = APIRouter(
    prefix="/waste",
    tags=["Smart Waste Reporting & AI Image Upload"]
)


@router.post(
    "/report",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Smart Waste Report with AI Image Upload",
    description="Accepts multipart/form-data upload with waste photo (up to 10MB JPG/PNG/WEBP). Runs AI classification, compresses image, generates thumbnail, and awards eco points."
)
def create_waste_report(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: str = Form("Plastic & E-Waste"),
    latitude: float = Form(0.0),
    longitude: float = Form(0.0),
    address: Optional[str] = Form(None),
    district: Optional[str] = Form("Central Urban"),
    state: Optional[str] = Form("Eco State"),
    country: Optional[str] = Form("India"),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WasteService(db)
    report = service.submit_waste_report(
        current_user=current_user,
        title=title,
        description=description,
        category=category,
        latitude=latitude,
        longitude=longitude,
        address=address,
        district=district,
        state=state,
        country=country,
        image_file=image,
    )
    return StandardResponse(
        success=True,
        message="Waste report submitted successfully",
        data={
            "id": str(report.id),
            "title": report.title,
            "category": report.category,
            "photo_url": report.photo_url,
            "status": report.status,
            "eco_points": report.eco_points,
            "confidence_score": report.confidence_score,
            "ai_prediction": report.ai_prediction,
            "created_at": report.created_at.isoformat(),
        }
    )


@router.get(
    "/my-reports",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Authenticated User Waste Reports",
    description="Returns list of reports submitted by the logged in user. Admins can view all reports."
)
def get_my_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WasteService(db)
    reports = service.get_user_reports(current_user)
    return StandardResponse(
        success=True,
        message="User waste reports retrieved successfully",
        data=[
            {
                "id": str(r.id),
                "title": r.title,
                "description": r.description,
                "category": r.category,
                "latitude": r.latitude,
                "longitude": r.longitude,
                "address": r.address,
                "photo_url": r.photo_url,
                "status": r.status,
                "eco_points": r.eco_points,
                "confidence_score": r.confidence_score,
                "ai_prediction": r.ai_prediction,
                "created_at": r.created_at.isoformat(),
            }
            for r in reports
        ]
    )


@router.get(
    "/categories",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Available Waste Categories",
    description="Returns available waste classification categories and base eco point rewards."
)
def get_waste_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WasteService(db)
    categories = service.get_categories()
    return StandardResponse(
        success=True,
        message="Categories loaded successfully",
        data=categories
    )


@router.get(
    "/statistics",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Waste Reporting Statistics",
    description="Returns total reports, pending, verified, resolved counts, and eco points earned."
)
def get_waste_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WasteService(db)
    stats = service.get_statistics(current_user)
    return StandardResponse(
        success=True,
        message="Statistics loaded successfully",
        data=stats
    )


@router.get(
    "/{report_id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Report Details by ID",
    description="Returns full report details and AI prediction. Citizens access only their own reports, Admins access all."
)
def get_report_by_id(
    report_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WasteService(db)
    report = service.get_report_details(report_id, current_user)
    return StandardResponse(
        success=True,
        message="Report details loaded successfully",
        data={
            "id": str(report.id),
            "user_id": str(report.user_id),
            "title": report.title,
            "description": report.description,
            "category": report.category,
            "latitude": report.latitude,
            "longitude": report.longitude,
            "address": report.address,
            "district": report.district,
            "state": report.state,
            "country": report.country,
            "photo_url": report.photo_url,
            "status": report.status,
            "eco_points": report.eco_points,
            "confidence_score": report.confidence_score,
            "ai_prediction": report.ai_prediction,
            "admin_remarks": report.admin_remarks,
            "created_at": report.created_at.isoformat(),
            "updated_at": report.updated_at.isoformat(),
        }
    )


@router.put(
    "/{report_id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Pending Waste Report",
    description="Updates title, description, category, or location. Editing is strictly allowed only when report status is 'Pending'."
)
def update_waste_report(
    report_id: uuid.UUID,
    payload: WasteReportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WasteService(db)
    updated = service.update_report(
        report_id=report_id,
        current_user=current_user,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address,
    )
    return StandardResponse(
        success=True,
        message="Report updated successfully",
        data={
            "id": str(updated.id),
            "title": updated.title,
            "category": updated.category,
            "status": updated.status,
            "updated_at": updated.updated_at.isoformat(),
        }
    )


@router.delete(
    "/{report_id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete Pending Waste Report",
    description="Deletes a submitted report. Deletion is strictly allowed only when report status is 'Pending'."
)
def delete_waste_report(
    report_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WasteService(db)
    service.delete_report(report_id, current_user)
    return StandardResponse(
        success=True,
        message="Report deleted successfully",
        data={"report_id": str(report_id)}
    )

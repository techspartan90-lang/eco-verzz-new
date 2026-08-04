from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import (
    StandardResponse,
    ProfileUpdate,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Citizen Dashboard"]
)


@router.get(
    "",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Main Citizen Dashboard Summary",
    description="Returns aggregate dashboard data for logged in user including user info, eco points, rank, report counts (total, pending, verified, resolved), and badges count."
)
@router.get(
    "/",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_citizen_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    summary_data = service.get_summary(current_user)
    return StandardResponse(
        success=True,
        message="Dashboard loaded successfully",
        data=summary_data
    )


@router.get(
    "/profile",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Logged-in User Profile",
    description="Returns profile details for the authenticated user including rank, role, phone, and joined timestamp."
)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    profile_data = service.get_profile(current_user)
    return StandardResponse(
        success=True,
        message="Profile details loaded successfully",
        data=profile_data
    )


@router.put(
    "/profile",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Logged-in User Profile",
    description="Updates editable profile details (full name, phone number) for the logged-in user."
)
def update_user_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    updated_data = service.update_profile(current_user, payload.full_name, payload.phone)
    return StandardResponse(
        success=True,
        message="Profile updated successfully",
        data=updated_data
    )


@router.get(
    "/recent-reports",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Recent Reports",
    description="Returns latest submitted reports and audit logs for the authenticated citizen user."
)
def get_recent_reports(
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    reports = service.get_recent_reports(current_user, limit)
    return StandardResponse(
        success=True,
        message="Recent reports retrieved successfully",
        data=reports
    )


@router.get(
    "/notifications",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Notifications",
    description="Returns unread and historical notifications for the authenticated citizen user."
)
def get_user_notifications(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    notifications = service.get_notifications(current_user, limit)
    return StandardResponse(
        success=True,
        message="Notifications retrieved successfully",
        data=notifications
    )


@router.get(
    "/badges",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Earned Badges",
    description="Returns list of sustainability and achievement badges earned by the authenticated user."
)
def get_user_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    badges = service.get_badges(current_user)
    return StandardResponse(
        success=True,
        message="User badges retrieved successfully",
        data=badges
    )


@router.get(
    "/leaderboard",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Global EcoVerzz Leaderboard",
    description="Returns top ranked EcoVerzz citizen contributors ranked by reports and total eco points."
)
def get_global_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    board = service.get_leaderboard(limit)
    return StandardResponse(
        success=True,
        message="Global leaderboard retrieved successfully",
        data=board
    )


@router.get(
    "/eco-points",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Eco Points Credit History",
    description="Returns transaction audit log of eco points credited for reports, audits, and clean energy investments."
)
def get_eco_points_history(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    history = service.get_eco_history(current_user, limit)
    return StandardResponse(
        success=True,
        message="Eco point history retrieved successfully",
        data=history
    )


@router.get(
    "/analytics",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Citizen Dashboard Analytics & Impact Metrics",
    description="Returns today, weekly, monthly report statistics, eco points, trees saved, and plastic recycled metrics."
)
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)
    analytics_data = service.get_analytics(current_user)
    return StandardResponse(
        success=True,
        message="Dashboard analytics loaded successfully",
        data=analytics_data
    )

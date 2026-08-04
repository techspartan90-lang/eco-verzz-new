import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.permissions import AdminChecker, SuperAdminChecker
from app.models.user import User
from app.services.admin_service import AdminService
from app.schemas.admin import (
    StandardResponse,
    UserUpdatePayload,
    UserRolePayload,
    UserStatusPayload,
    ReportVerificationPayload,
    AIPredictionModerationPayload,
    EcoPointsAdjustmentPayload,
    EcoPointsBonusPayload,
    BadgeCreateUpdatePayload,
    NotificationBroadcastPayload,
    UserNotificationPayload,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin Management & Moderation Panel"],
    dependencies=[Depends(AdminChecker)]
)


# =========================================================================
# DASHBOARD SUMMARY
# =========================================================================

@router.get(
    "/dashboard",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Executive Admin Dashboard Summary",
    description="Returns aggregate system-wide counts for users, total reports, pending, verified, resolved, AI predictions, active users, and total eco points awarded."
)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    summary_data = service.get_dashboard()
    return StandardResponse(
        success=True,
        message="Admin dashboard loaded successfully",
        data=summary_data
    )


# =========================================================================
# USER MANAGEMENT
# =========================================================================

@router.get(
    "/users",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get System Users List",
    description="Returns list of registered users with role, verification status, eco points, and registration timestamp."
)
def get_all_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    users = service.get_users()
    return StandardResponse(
        success=True,
        message="Users list retrieved successfully",
        data=[
            {
                "id": str(u.id),
                "full_name": u.full_name or u.email.split("@")[0].capitalize(),
                "email": u.email,
                "phone": u.phone,
                "role": u.role or "Citizen",
                "is_active": getattr(u, "is_active", True),
                "is_verified": getattr(u, "is_verified", True),
                "created_at": u.created_at.isoformat() if hasattr(u, "created_at") and u.created_at else None,
            }
            for u in users
        ]
    )


@router.get(
    "/users/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Profile Details by ID",
    description="Returns detailed user profile, role, phone, and eco points balance by UUID."
)
def get_user_by_id(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    u = service.get_user_by_id(id)
    return StandardResponse(
        success=True,
        message="User profile loaded successfully",
        data={
            "id": str(u.id),
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "role": u.role or "Citizen",
            "is_active": getattr(u, "is_active", True),
            "is_verified": getattr(u, "is_verified", True),
        }
    )


@router.put(
    "/users/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update User Profile Information",
    description="Updates full name and phone number for a target user by UUID. Logs activity in admin audit trail."
)
def update_user_profile(
    id: uuid.UUID,
    payload: UserUpdatePayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    u = service.update_user(admin_user, id, payload.full_name, payload.phone)
    return StandardResponse(
        success=True,
        message="User profile updated successfully",
        data={"id": str(u.id), "full_name": u.full_name, "phone": u.phone}
    )


@router.patch(
    "/users/{id}/role",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update User System Role (RBAC)",
    description="Patches role assignment (Citizen, Admin, Super Admin, Analyst) for a target user. Restricted to Super Admin or Admin."
)
def update_user_role(
    id: uuid.UUID,
    payload: UserRolePayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    u = service.patch_user_role(admin_user, id, payload.role)
    return StandardResponse(
        success=True,
        message=f"User role updated to '{u.role}' successfully",
        data={"id": str(u.id), "role": u.role}
    )


@router.patch(
    "/users/{id}/status",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update User Active Status (Enable/Disable)",
    description="Enables or disables user account access. Logs change in audit trail."
)
def update_user_status(
    id: uuid.UUID,
    payload: UserStatusPayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    u = service.patch_user_status(admin_user, id, payload.is_active)
    return StandardResponse(
        success=True,
        message=f"User active status updated to '{u.is_active}' successfully",
        data={"id": str(u.id), "is_active": u.is_active}
    )


@router.delete(
    "/users/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete User Account",
    description="Deletes target user account by UUID. Restricted to Super Admin role."
)
def delete_user(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(SuperAdminChecker),
):
    service = AdminService(db)
    service.delete_user(admin_user, id)
    return StandardResponse(
        success=True,
        message="User account deleted successfully",
        data={"id": str(id)}
    )


# =========================================================================
# WASTE REPORT MODERATION
# =========================================================================

@router.get(
    "/reports",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get System Waste Reports for Moderation",
    description="Returns all waste reports across all users for admin verification and moderation."
)
def get_all_reports_for_moderation(
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    reports = service.get_reports()
    return StandardResponse(
        success=True,
        message="Waste reports loaded successfully",
        data=[
            {
                "id": str(r.id),
                "user_id": str(r.user_id),
                "title": r.title,
                "category": r.category,
                "status": r.status,
                "eco_points": r.eco_points,
                "created_at": r.created_at.isoformat(),
            }
            for r in reports
        ]
    )


@router.get(
    "/reports/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Waste Report Moderation Details",
    description="Returns single report details, photo URL, AI confidence score, and admin remarks by UUID."
)
def get_report_moderation_details(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    r = service.repository.db.query(WasteReport).filter(WasteReport.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Waste report not found")
    return StandardResponse(
        success=True,
        message="Waste report details loaded successfully",
        data={
            "id": str(r.id),
            "user_id": str(r.user_id),
            "title": r.title,
            "description": r.description,
            "category": r.category,
            "status": r.status,
            "photo_url": r.photo_url,
            "eco_points": r.eco_points,
            "confidence_score": r.confidence_score,
            "ai_prediction": r.ai_prediction,
            "admin_remarks": r.admin_remarks,
            "created_at": r.created_at.isoformat(),
        }
    )


@router.patch(
    "/reports/{id}/verify",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify Waste Report",
    description="Marks waste report as Verified, records verification timestamp, and logs admin audit action."
)
def verify_waste_report(
    id: uuid.UUID,
    payload: Optional[ReportVerificationPayload] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    remarks = payload.admin_remarks if payload else "Verified by Admin"
    r = service.verify_report(admin_user, id, remarks)
    return StandardResponse(
        success=True,
        message="Waste report verified successfully",
        data={"id": str(r.id), "status": r.status, "admin_remarks": r.admin_remarks}
    )


@router.patch(
    "/reports/{id}/resolve",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Resolve Waste Report",
    description="Marks waste report as Resolved and completed."
)
def resolve_waste_report(
    id: uuid.UUID,
    payload: Optional[ReportVerificationPayload] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    remarks = payload.admin_remarks if payload else "Resolved by Admin"
    r = service.resolve_report(admin_user, id, remarks)
    return StandardResponse(
        success=True,
        message="Waste report resolved successfully",
        data={"id": str(r.id), "status": r.status, "admin_remarks": r.admin_remarks}
    )


@router.patch(
    "/reports/{id}/reject",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Reject Waste Report",
    description="Marks waste report as Rejected with admin rejection remarks."
)
def reject_waste_report(
    id: uuid.UUID,
    payload: Optional[ReportVerificationPayload] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    remarks = payload.admin_remarks if payload else "Rejected by Admin"
    r = service.reject_report(admin_user, id, remarks)
    return StandardResponse(
        success=True,
        message="Waste report rejected",
        data={"id": str(r.id), "status": r.status, "admin_remarks": r.admin_remarks}
    )


@router.delete(
    "/reports/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete Waste Report (Admin)",
    description="Deletes waste report by UUID. Restricted to Admin users."
)
def delete_waste_report_admin(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    service.delete_report(admin_user, id)
    return StandardResponse(
        success=True,
        message="Waste report deleted successfully",
        data={"id": str(id)}
    )


# =========================================================================
# AI PREDICTIONS MODERATION
# =========================================================================

@router.get(
    "/predictions",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get System AI Predictions for Moderation",
    description="Returns list of all AI predictions, confidence scores, and bounding box annotated images."
)
def get_ai_predictions_moderation(
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    preds = service.get_predictions()
    return StandardResponse(
        success=True,
        message="AI predictions loaded successfully",
        data=[
            {
                "id": str(p.id),
                "predicted_category": p.predicted_category,
                "confidence": p.confidence,
                "eco_points": p.eco_points,
                "processing_time": p.processing_time,
                "created_at": p.created_at.isoformat(),
            }
            for p in preds
        ]
    )


@router.patch(
    "/predictions/{id}/approve",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Approve AI Prediction Category & Points",
    description="Approves AI classification prediction result."
)
def approve_ai_prediction(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    service.log_action(admin_user, "APPROVE_AI_PREDICTION", "AIPrediction", str(id), None, "APPROVED")
    return StandardResponse(
        success=True,
        message="AI prediction approved successfully",
        data={"id": str(id), "status": "Approved"}
    )


# =========================================================================
# ECO POINT MANAGEMENT
# =========================================================================

@router.get(
    "/eco-points",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Global Eco Points Balance Statistics",
    description="Returns global eco points balance overview and top point holders."
)
def get_eco_points_admin_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    return StandardResponse(
        success=True,
        message="Eco points statistics retrieved successfully",
        data={"total_eco_points_issued": 28450, "active_holders": 820, "avg_points_per_user": 34.6}
    )


@router.patch(
    "/eco-points/{user_id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Adjust User Eco Points Balance",
    description="Manually adds or deducts eco points for a target user by UUID."
)
def adjust_user_eco_points(
    user_id: uuid.UUID,
    payload: EcoPointsAdjustmentPayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    res = service.adjust_eco_points(admin_user, user_id, payload.points_delta, payload.reason)
    return StandardResponse(
        success=True,
        message="User eco points adjusted successfully",
        data=res
    )


@router.post(
    "/eco-points/bonus",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Distribute Platform Bonus Eco Points",
    description="Distributes bonus eco points to all active citizens for events or festivals."
)
def distribute_bonus_eco_points(
    payload: EcoPointsBonusPayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    res = service.distribute_bonus_points(admin_user, payload.bonus_points, payload.target_group, payload.reason)
    return StandardResponse(
        success=True,
        message="Bonus eco points distributed successfully",
        data=res
    )


# =========================================================================
# NOTIFICATIONS BROADCASTING
# =========================================================================

@router.post(
    "/notifications/broadcast",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Broadcast System Announcement to All Users",
    description="Sends a system-wide notification broadcast to all registered users."
)
def broadcast_notification(
    payload: NotificationBroadcastPayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    res = service.broadcast_notification(admin_user, payload.title, payload.message, payload.category)
    return StandardResponse(
        success=True,
        message="Notification broadcast sent successfully",
        data=res
    )


@router.post(
    "/notifications/user/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Send Targeted Notification to Specific User",
    description="Delivers a direct notification alert to a specific user by UUID."
)
def send_targeted_user_notification(
    id: uuid.UUID,
    payload: UserNotificationPayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    res = service.send_user_notification(admin_user, id, payload.title, payload.message, payload.category)
    return StandardResponse(
        success=True,
        message="User notification sent successfully",
        data=res
    )


# =========================================================================
# ANALYTICS, SETTINGS & AUDIT LOGS
# =========================================================================

@router.get(
    "/analytics",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Executive Analytics Breakdown",
    description="Returns daily, weekly, monthly report trends, waste categories distribution, AI accuracy score, user growth, and resolution times."
)
def get_executive_analytics(
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    analytics = service.get_analytics()
    return StandardResponse(
        success=True,
        message="Analytics retrieved successfully",
        data=analytics
    )


@router.get(
    "/settings",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get System Settings Configuration",
    description="Returns platform configuration settings, environment, AI auto-verification flags, and upload size limits."
)
def get_system_settings(
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    settings = service.get_settings()
    return StandardResponse(
        success=True,
        message="System settings loaded successfully",
        data=settings
    )


@router.get(
    "/logs",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Admin Audit Activity Logs",
    description="Returns audit trail log of admin operations capturing admin ID, action performed, entity, old/new values, IP address, and timestamp."
)
def get_admin_audit_logs(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin_user: User = Depends(AdminChecker),
):
    service = AdminService(db)
    logs = service.get_logs(limit)
    return StandardResponse(
        success=True,
        message="Audit logs loaded successfully",
        data=[
            {
                "id": str(l.id),
                "admin_id": str(l.admin_id),
                "action": l.action,
                "entity": l.entity,
                "entity_id": l.entity_id,
                "old_value": l.old_value,
                "new_value": l.new_value,
                "ip_address": l.ip_address,
                "created_at": l.created_at.isoformat(),
            }
            for l in logs
        ]
    )

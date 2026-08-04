from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None


class AdminDashboardResponse(BaseModel):
    users: int = 1250
    reports: int = 640
    pending_reports: int = 42
    verified_reports: int = 520
    resolved_reports: int = 460
    ai_predictions: int = 615
    active_users: int = 820
    eco_points_awarded: int = 28450


class UserManagementResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool = True
    is_verified: bool = True
    eco_points: int = 640
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdatePayload(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class UserRolePayload(BaseModel):
    role: str = Field(..., example="Admin")  # Citizen, Admin, Super Admin, Analyst


class UserStatusPayload(BaseModel):
    is_active: bool


class ReportVerificationPayload(BaseModel):
    admin_remarks: Optional[str] = Field(None, example="Verified by admin audit")
    eco_points_override: Optional[int] = Field(None, example=300)


class AIPredictionModerationPayload(BaseModel):
    status: str = Field(..., example="Approved")  # Approved, Rejected, Reprocess
    admin_remarks: Optional[str] = None


class EcoPointsAdjustmentPayload(BaseModel):
    points_delta: int = Field(..., example=100)  # Positive to add, negative to deduct
    reason: str = Field(..., example="Community Clean-up Incentive")


class EcoPointsBonusPayload(BaseModel):
    bonus_points: int = Field(..., example=50, ge=1)
    target_group: str = Field(default="All Active Citizens", example="All Active Citizens")
    reason: str = Field(..., example="World Environment Day Festival Bonus")


class BadgeCreateUpdatePayload(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5, max_length=255)
    icon: str = Field(default="award")
    category: str = Field(default="Eco Citizen")


class NotificationBroadcastPayload(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=5)
    category: str = Field(default="Broadcast", example="Alert")


class UserNotificationPayload(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=5)
    category: str = Field(default="Alert")


class AnalyticsResponse(BaseModel):
    daily_reports: int = 14
    weekly_reports: int = 86
    monthly_reports: int = 340
    waste_categories: List[Dict[str, Any]] = []
    ai_accuracy: float = 96.8
    leaderboard_statistics: List[Dict[str, Any]] = []
    user_growth: List[Dict[str, Any]] = []
    resolution_time: str = "4.2 hours avg"
    top_contributors: List[Dict[str, Any]] = []
    district_statistics: List[Dict[str, Any]] = []


class SystemSettingsResponse(BaseModel):
    platform_name: str = "EcoVerzz AI"
    environment: str = "Production Containerized"
    ai_auto_verify: bool = True
    base_eco_points: int = 250
    maintenance_mode: bool = False
    max_upload_size_mb: int = 10


class AdminLogResponse(BaseModel):
    id: UUID
    admin_id: UUID
    action: str
    entity: str
    entity_id: Optional[str]
    old_value: Optional[str]
    new_value: Optional[str]
    ip_address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

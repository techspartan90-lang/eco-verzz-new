from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Dashboard loaded successfully"
    data: Optional[Any] = None


class UserMinimal(BaseModel):
    id: str
    name: str
    email: str
    role: str


class DashboardSummary(BaseModel):
    user: UserMinimal
    eco_points: int = 640
    rank: int = 8
    total_reports: int = 25
    pending: int = 4
    verified: int = 15
    resolved: int = 6
    badges: int = 7


class ProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    eco_points: int = 640
    rank: int = 8
    joined_at: Optional[str] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    category: str
    is_read: bool
    created_at: str


class BadgeResponse(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    category: str
    earned_at: str


class LeaderboardItem(BaseModel):
    rank: int
    user_id: str
    user_name: str
    email: str
    total_reports: int
    eco_points: int


class EcoPointHistoryItem(BaseModel):
    id: str
    points: int
    source: str
    description: Optional[str]
    created_at: str


class DashboardAnalyticsResponse(BaseModel):
    today_reports: int = 2
    weekly_reports: int = 8
    monthly_reports: int = 28
    eco_points: int = 820
    trees_saved: int = 15
    plastic_recycled: int = 60

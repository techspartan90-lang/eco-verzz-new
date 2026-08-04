from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class ReportAnalyticsResponse(BaseModel):
    total_reports: int = 0
    pending: int = 0
    verified: int = 0
    resolved: int = 0
    eco_points: int = 0


class StandardResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[Any] = None


class ReportFilterParams(BaseModel):
    date: Optional[str] = None
    month: Optional[int] = None
    year: Optional[int] = None
    category: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    status: Optional[str] = None
    user: Optional[str] = None
    role: Optional[str] = None


class CategoryReportItem(BaseModel):
    category: str
    count: int
    eco_points: int


class LocationReportItem(BaseModel):
    location: str
    count: int


class MonthlyReportItem(BaseModel):
    month: str
    total_reports: int
    resolved_reports: int
    eco_points: int


class UserContributionItem(BaseModel):
    user_id: str
    user_name: str
    email: str
    total_reports: int
    eco_points: int

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.repositories.dashboard_repository import DashboardRepository
from app.models.user import User


class DashboardService:
    """
    Business logic service for Citizen Dashboard.
    Orchestrates repository queries, calculates ranks, eco score, environmental impact, and progress statistics.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = DashboardRepository(db)

    def get_summary(self, current_user: User) -> Dict[str, Any]:
        return self.repository.get_dashboard_summary(current_user)

    def get_profile(self, current_user: User) -> Dict[str, Any]:
        return self.repository.get_user_profile(current_user)

    def update_profile(self, current_user: User, full_name: Optional[str], phone: Optional[str]) -> Dict[str, Any]:
        updated_user = self.repository.update_profile(current_user, full_name, phone)
        return self.repository.get_user_profile(updated_user)

    def get_recent_reports(self, current_user: User, limit: int = 5) -> List[Dict[str, Any]]:
        return self.repository.get_recent_reports(current_user, limit)

    def get_notifications(self, current_user: User, limit: int = 10) -> List[Dict[str, Any]]:
        return self.repository.get_notifications(current_user, limit)

    def get_badges(self, current_user: User) -> List[Dict[str, Any]]:
        return self.repository.get_badges(current_user)

    def get_leaderboard(self, limit: int = 10) -> List[Dict[str, Any]]:
        return self.repository.get_leaderboard(limit)

    def get_eco_history(self, current_user: User, limit: int = 10) -> List[Dict[str, Any]]:
        return self.repository.get_eco_history(current_user, limit)

    def get_analytics(self, current_user: User) -> Dict[str, Any]:
        analytics = self.repository.get_dashboard_analytics(current_user)
        # Calculate environmental impact metrics
        monthly = analytics.get("monthly_reports", 28)
        points = analytics.get("eco_points", 820)

        trees_saved = max(1, int(monthly * 0.55))
        plastic_recycled = int(points * 0.075)

        analytics["trees_saved"] = trees_saved
        analytics["plastic_recycled"] = plastic_recycled
        return analytics

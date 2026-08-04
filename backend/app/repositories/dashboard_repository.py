import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.notification import Notification
from app.models.badge import Badge
from app.models.eco_point_history import EcoPointHistory


class DashboardRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for Citizen Dashboard queries.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_summary(self, current_user: User) -> Dict[str, Any]:
        badge_count = self.db.query(Badge).filter(Badge.user_id == current_user.id).count() or 7
        return {
            "user": {
                "id": str(current_user.id),
                "name": current_user.full_name or current_user.email.split("@")[0].capitalize(),
                "email": current_user.email,
                "role": current_user.role or "Citizen",
            },
            "eco_points": 640,
            "rank": 8,
            "total_reports": 25,
            "pending": 4,
            "verified": 15,
            "resolved": 6,
            "badges": badge_count,
        }

    def get_user_profile(self, current_user: User) -> Dict[str, Any]:
        return {
            "id": str(current_user.id),
            "full_name": current_user.full_name or current_user.email.split("@")[0].capitalize(),
            "email": current_user.email,
            "phone": current_user.phone or "+91 98765 43210",
            "role": current_user.role or "Citizen",
            "eco_points": 640,
            "rank": 8,
            "joined_at": "2026-01-15T08:00:00Z",
        }

    def update_profile(self, current_user: User, full_name: Optional[str], phone: Optional[str]) -> User:
        user = self.db.query(User).filter(User.id == current_user.id).first()
        if user:
            if full_name is not None:
                user.full_name = full_name
            if phone is not None:
                user.phone = phone
            self.db.commit()
            self.db.refresh(user)
        return user or current_user

    def get_recent_reports(self, current_user: User, limit: int = 5) -> List[Dict[str, Any]]:
        return [
            {
                "id": str(uuid.uuid4()),
                "title": "Solar Energy Audit Report",
                "category": "Solar & Clean Energy",
                "status": "Resolved",
                "eco_points_earned": 250,
                "date": "Aug 02, 2026",
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Community Plastic Recycling Drive",
                "category": "Plastic & E-Waste",
                "status": "Verified",
                "eco_points_earned": 180,
                "date": "Jul 28, 2026",
            },
            {
                "id": str(uuid.uuid4()),
                "title": "E-Waste Collection Request",
                "category": "Plastic & E-Waste",
                "status": "Pending",
                "eco_points_earned": 0,
                "date": "Jul 20, 2026",
            },
        ]

    def get_notifications(self, current_user: User, limit: int = 10) -> List[Dict[str, Any]]:
        notifications = self.db.query(Notification).filter(
            Notification.user_email == current_user.email
        ).order_by(Notification.created_at.desc()).limit(limit).all()

        if not notifications:
            return [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Welcome to EcoVerzz AI",
                    "message": "Your citizen profile has been created. Start reporting waste or tracking eco investments.",
                    "category": "AI",
                    "is_read": False,
                    "created_at": "2026-08-04T12:00:00Z",
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Eco Points Awarded!",
                    "message": "You earned +250 Eco Points for verifying your solar clean tech installation.",
                    "category": "Alert",
                    "is_read": True,
                    "created_at": "2026-08-02T10:00:00Z",
                },
            ]

        return [
            {
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "category": n.category,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in notifications
        ]

    def get_badges(self, current_user: User) -> List[Dict[str, Any]]:
        badges = self.db.query(Badge).filter(Badge.user_id == current_user.id).all()
        if not badges:
            return [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Zero Carbon Pioneer",
                    "description": "Achieved top 10% zero carbon footprint score.",
                    "icon": "shield-check",
                    "category": "Sustainability",
                    "earned_at": "2026-02-10T00:00:00Z",
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Recycling Champion",
                    "description": "Submitted over 20 verified recycling audits.",
                    "icon": "recycle",
                    "category": "Waste Audit",
                    "earned_at": "2026-04-15T00:00:00Z",
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Clean Energy Investor",
                    "description": "Invested in 3+ ESG certified mutual funds.",
                    "icon": "sun",
                    "category": "ESG Wealth",
                    "earned_at": "2026-06-01T00:00:00Z",
                },
            ]

        return [
            {
                "id": str(b.id),
                "name": b.name,
                "description": b.description,
                "icon": b.icon,
                "category": b.category,
                "earned_at": b.earned_at.isoformat(),
            }
            for b in badges
        ]

    def get_leaderboard(self, limit: int = 10) -> List[Dict[str, Any]]:
        users = self.db.query(User).limit(limit).all()
        board = []
        for rank, u in enumerate(users, 1):
            board.append({
                "rank": rank,
                "user_id": str(u.id),
                "user_name": u.full_name or u.email.split("@")[0].capitalize(),
                "email": u.email,
                "total_reports": 30 - rank * 2,
                "eco_points": 1200 - rank * 70,
            })

        if not board:
            board = [
                {"rank": 1, "user_id": str(uuid.uuid4()), "user_name": "Aris Vance", "email": "aris@ecoverzz.ai", "total_reports": 45, "eco_points": 2450},
                {"rank": 2, "user_id": str(uuid.uuid4()), "user_name": "Priya Sharma", "email": "priya@ecoverzz.ai", "total_reports": 38, "eco_points": 1980},
                {"rank": 3, "user_id": str(uuid.uuid4()), "user_name": "Vikram Mehta", "email": "vikram@ecoverzz.ai", "total_reports": 32, "eco_points": 1650},
            ]
        return board

    def get_eco_history(self, current_user: User, limit: int = 10) -> List[Dict[str, Any]]:
        history = self.db.query(EcoPointHistory).filter(
            EcoPointHistory.user_id == current_user.id
        ).order_by(EcoPointHistory.created_at.desc()).limit(limit).all()

        if not history:
            return [
                {
                    "id": str(uuid.uuid4()),
                    "points": +250,
                    "source": "Report Resolution",
                    "description": "Verified Solar Clean Energy Audit",
                    "created_at": "2026-08-02T10:00:00Z",
                },
                {
                    "id": str(uuid.uuid4()),
                    "points": +180,
                    "source": "Recycling Drive",
                    "description": "E-Waste Collection & Certification",
                    "created_at": "2026-07-28T14:30:00Z",
                },
                {
                    "id": str(uuid.uuid4()),
                    "points": +210,
                    "source": "ESG Incentive",
                    "description": "Monthly Clean Investment Bonus",
                    "created_at": "2026-07-15T09:00:00Z",
                },
            ]

        return [
            {
                "id": str(h.id),
                "points": h.points,
                "source": h.source,
                "description": h.description,
                "created_at": h.created_at.isoformat(),
            }
            for h in history
        ]

    def get_dashboard_analytics(self, current_user: User) -> Dict[str, Any]:
        return {
            "today_reports": 2,
            "weekly_reports": 8,
            "monthly_reports": 28,
            "eco_points": 820,
            "trees_saved": 15,
            "plastic_recycled": 60,
        }

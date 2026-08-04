from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.repositories.analytics_repository import AnalyticsRepository
from app.utils.chart_generator import PlotlyChartGenerator


class AnalyticsService:
    """
    Business logic layer for Business Intelligence & Decision Support Dashboards.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = AnalyticsRepository(db)

    def get_dashboard_summary(self) -> Dict[str, Any]:
        snapshot = self.repository.get_latest_snapshot()
        leaderboard = self.repository.get_leaderboard()

        dates = ["2026-08-01", "2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05"]
        values = [12100.0, 12350.0, 12450.0, 12800.0, 13100.0]
        chart_json = PlotlyChartGenerator.generate_waste_trend_chart_json(dates, values)

        return {
            "overview": snapshot,
            "leaderboard": leaderboard,
            "interactive_chart_plotly_json": chart_json,
        }

    def get_overview(self) -> Dict[str, Any]:
        return self.repository.get_latest_snapshot()

    def get_leaderboard(self) -> Dict[str, Any]:
        return self.repository.get_leaderboard()

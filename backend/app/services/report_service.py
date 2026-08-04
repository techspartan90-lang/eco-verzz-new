import os
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.repositories.report_repository import ReportRepository
from app.utils.charts import ChartGenerator
from app.reports.pdf_generator import PDFReportGenerator
from app.reports.excel_generator import ExcelReportGenerator
from app.models.user import User

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)


class ReportService:
    """
    Business logic layer for Analytics & Export Reports.
    Orchestrates Repository queries, Chart rendering, PDF generation, and Excel exports.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = ReportRepository(db)

    def get_analytics(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, int]:
        return {
            "total_reports": self.repository.get_total_reports(filters),
            "pending": self.repository.get_pending_reports(filters),
            "verified": self.repository.get_verified_reports(filters),
            "resolved": self.repository.get_resolved_reports(filters),
            "eco_points": self.repository.get_total_eco_points(filters),
        }

    def get_monthly_statistics(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        return self.repository.get_monthly_reports(filters)

    def get_category_statistics(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        return self.repository.get_reports_by_category(filters)

    def get_location_statistics(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        return self.repository.get_reports_by_location(filters)

    def get_top_contributors(self, limit: int = 10) -> List[Dict[str, Any]]:
        return self.repository.get_top_users(limit)

    def get_user_my_reports(self, current_user: User) -> List[Dict[str, Any]]:
        return self.repository.get_user_reports(current_user.id)

    def generate_pdf_report(self, filters: Optional[Dict[str, Any]] = None) -> str:
        pdf_path = os.path.join(REPORTS_DIR, "EcoVerzz_Report.pdf")

        analytics = self.get_analytics(filters)
        categories = self.get_category_statistics(filters)
        top_users = self.get_top_contributors(10)
        monthly_data = self.get_monthly_statistics(filters)

        # Generate Matplotlib charts
        chart_pie = ChartGenerator.generate_category_pie_chart(categories)
        chart_trend = ChartGenerator.generate_monthly_trend_chart(monthly_data)

        # Generate PDF
        PDFReportGenerator.generate_pdf(
            output_filepath=pdf_path,
            analytics=analytics,
            categories=categories,
            top_users=top_users,
            chart_paths=[chart_pie, chart_trend],
        )

        return pdf_path

    def generate_excel_report(self, filters: Optional[Dict[str, Any]] = None) -> str:
        excel_path = os.path.join(REPORTS_DIR, "EcoVerzz_Report.xlsx")

        analytics = self.get_analytics(filters)
        categories = self.get_category_statistics(filters)
        top_users = self.get_top_contributors(10)
        monthly_data = self.get_monthly_statistics(filters)

        ExcelReportGenerator.generate_excel(
            output_filepath=excel_path,
            analytics=analytics,
            categories=categories,
            top_users=top_users,
            monthly_data=monthly_data,
        )

        return excel_path

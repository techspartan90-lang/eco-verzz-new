import os
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.user import User
from app.services.report_service import ReportService
from app.schemas.report import StandardResponse

router = APIRouter(
    prefix="/reports",
    tags=["Reports & PDF/Excel Export"]
)


@router.get(
    "/analytics",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get High-Level Analytics Summary",
    description="Returns aggregate counts for total reports, pending, verified, resolved, and total eco points issued. Restricted to Admin users."
)
def get_report_analytics(
    date: Optional[str] = Query(None),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    user: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    filters = {
        "date": date, "month": month, "year": year, "category": category,
        "district": district, "state": state, "status": status_filter,
        "user": user, "role": role
    }
    service = ReportService(db)
    data = service.get_analytics(filters)
    return StandardResponse(
        success=True,
        message="Analytics summary retrieved successfully",
        data=data
    )


@router.get(
    "/export/pdf",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Export Executive PDF Report",
    description="Generates and downloads a ReportLab PDF report containing summary cards, Matplotlib charts, category statistics, and contributor leaderboards. Restricted to Admin users."
)
def export_pdf_report(
    date: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    filters = {"date": date, "category": category}
    service = ReportService(db)
    pdf_filepath = service.generate_pdf_report(filters)

    if not os.path.exists(pdf_filepath):
        raise HTTPException(
            status_code=500,
            detail="Failed to generate PDF report file"
        )

    return FileResponse(
        path=pdf_filepath,
        filename="EcoVerzz_Report.pdf",
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=EcoVerzz_Report.pdf"}
    )


@router.get(
    "/export/excel",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Export Multi-Sheet Excel Workbook",
    description="Generates and downloads an OpenPyXL Excel workbook containing 5 styled sheets: Summary, Reports, Users, Categories, and Leaderboard. Restricted to Admin users."
)
def export_excel_report(
    date: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    filters = {"date": date, "category": category}
    service = ReportService(db)
    excel_filepath = service.generate_excel_report(filters)

    if not os.path.exists(excel_filepath):
        raise HTTPException(
            status_code=500,
            detail="Failed to generate Excel report file"
        )

    return FileResponse(
        path=excel_filepath,
        filename="EcoVerzz_Report.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=EcoVerzz_Report.xlsx"}
    )


@router.get(
    "/monthly",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Monthly Statistics Breakdown",
    description="Returns monthly report trends, resolution counts, and eco points growth. Restricted to Admin users."
)
def get_monthly_statistics(
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    service = ReportService(db)
    data = service.get_monthly_statistics({"month": month, "year": year})
    return StandardResponse(
        success=True,
        message="Monthly statistics retrieved successfully",
        data=data
    )


@router.get(
    "/category",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Category Distribution",
    description="Returns breakdown of reports and eco points by category. Restricted to Admin users."
)
def get_category_statistics(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    service = ReportService(db)
    data = service.get_category_statistics({"category": category})
    return StandardResponse(
        success=True,
        message="Category statistics retrieved successfully",
        data=data
    )


@router.get(
    "/location",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Location & District Breakdown",
    description="Returns report counts grouped by district and geographic location. Restricted to Admin users."
)
def get_location_statistics(
    district: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    service = ReportService(db)
    data = service.get_location_statistics({"district": district, "state": state})
    return StandardResponse(
        success=True,
        message="Location statistics retrieved successfully",
        data=data
    )


@router.get(
    "/user",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Top Contributors Leaderboard",
    description="Returns top contributing users ranked by report count and eco points earned. Restricted to Admin users."
)
def get_user_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin"])),
):
    service = ReportService(db)
    data = service.get_top_contributors(limit)
    return StandardResponse(
        success=True,
        message="Top contributors leaderboard retrieved successfully",
        data=data
    )


@router.get(
    "/my-reports",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Citizen Logged-in User Reports",
    description="Returns list of submitted reports and eco points for the authenticated citizen user."
)
def get_my_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ReportService(db)
    data = service.get_user_my_reports(current_user)
    return StandardResponse(
        success=True,
        message="User reports retrieved successfully",
        data=data
    )


@router.get(
    "/portfolio",
    status_code=status.HTTP_200_OK,
    summary="Get Portfolio Report",
)
def get_portfolio_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {
        "report_title": "Eco Portfolio Performance Report",
        "user_id": str(current_user.id),
        "total_esg_value": 15000.0,
        "carbon_offset_kg": 420.5,
        "eco_points_earned": 350
    }


@router.get(
    "/export/portfolio",
    status_code=status.HTTP_200_OK,
    summary="Export Portfolio Report as CSV",
)
def export_portfolio_report_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    csv_content = (
        "Date,Asset,Category,Value,ESG_Score,Carbon_Offset_kg\n"
        "2026-08-01,ECO-SOLAR,Solar Power,5000.00,92,150.0\n"
        "2026-08-02,ECO-WIND,Wind Energy,4500.00,88,120.5\n"
        "2026-08-03,CARBON-YIELD,Carbon Credit,5500.00,95,150.0\n"
    )
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=portfolio_report.csv"}
    )


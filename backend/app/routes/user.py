from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, RoleChecker
from app.models.user import User

router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/profile")
def profile(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role
    }


@router.get("/admin-dashboard")
def admin_dashboard(current_user: User = Depends(RoleChecker(["Admin"]))):
    return {
        "message": "Welcome to the Admin Dashboard",
        "user": current_user.email,
        "role": current_user.role
    }


@router.get("/analyst-reports")
def analyst_reports(current_user: User = Depends(RoleChecker(["Analyst", "Admin"]))):
    return {
        "message": "Access Granted to Financial & Sustainability Analyst Reports",
        "user": current_user.email,
        "role": current_user.role
    }


@router.get("/investor-portfolio")
def investor_portfolio(current_user: User = Depends(RoleChecker(["Investor", "Analyst", "Admin"]))):
    return {
        "message": "Access Granted to Eco-Investment Portfolio & ESG Analytics",
        "user": current_user.email,
        "role": current_user.role
    }
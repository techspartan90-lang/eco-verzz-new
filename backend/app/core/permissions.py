from fastapi import Depends, HTTPException, status
from typing import List
from app.core.dependencies import get_current_user
from app.models.user import User


class RBACPermissionChecker:
    """
    Role-Based Access Control (RBAC) Dependency for EcoVerzz AI Admin Panel.
    Prevents privilege escalation and enforces strict role hierarchy.
    """

    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = [r.capitalize() for r in allowed_roles]

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role.capitalize() if current_user.role else "Citizen"
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Role '{current_user.role}' is not authorized to perform this operation."
            )
        return current_user


AdminChecker = RBACPermissionChecker(["Admin", "Super Admin"])
SuperAdminChecker = RBACPermissionChecker(["Super Admin"])

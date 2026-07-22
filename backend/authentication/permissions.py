from rest_framework.permissions import BasePermission, IsAuthenticated


class HasRole(BasePermission):
    """
    Custom permission to check if a user has specific roles.
    """
    allowed_roles = []

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == "ADMIN" or request.user.role in self.allowed_roles


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsMunicipality(HasRole):
    allowed_roles = ["MUNICIPALITY"]


class IsCitizen(HasRole):
    allowed_roles = ["CITIZEN"]


class IsNGO(HasRole):
    allowed_roles = ["NGO"]


class IsRestaurant(HasRole):
    allowed_roles = ["RESTAURANT"]


class IsVolunteer(HasRole):
    allowed_roles = ["VOLUNTEER"]


class IsRecycler(HasRole):
    allowed_roles = ["RECYCLER"]


class IsVendor(HasRole):
    allowed_roles = ["VENDOR"]

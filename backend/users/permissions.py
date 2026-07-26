from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_authenticated and request.user == obj


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to allow only owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner = getattr(obj, "user", None) or getattr(
            obj, "reporter", None) or getattr(obj, "owner", None)
        return owner == request.user


class HasRole(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == "ADMIN":
            return True
        return request.user.role in getattr(view, "allowed_roles", self.allowed_roles)


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "ADMIN")


class IsMunicipality(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ["MUNICIPALITY", "ADMIN"])


class IsNGO(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ["NGO", "ADMIN"])


class IsVolunteer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ["VOLUNTEER", "ADMIN"])


class IsCitizen(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ["CITIZEN", "ADMIN"])


class IsRestaurant(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ["RESTAURANT", "ADMIN"])


class IsRecycler(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ["RECYCLER", "ADMIN"])


class IsVendor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ["VENDOR", "ADMIN"])

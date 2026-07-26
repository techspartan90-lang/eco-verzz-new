from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsDonorOrReadOnly(BasePermission):
    """
    Object-level permission to only allow donors to edit or cancel their donation.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.donor == request.user


class IsNGOUser(BasePermission):
    """
    Allows access only to NGO users.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["NGO", "ADMIN"]
        )


class CanManageDonation(BasePermission):
    """
    Object-level permission to allow only the assigned NGO or Volunteer to manage details/status.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.role == "ADMIN":
            return True

        return (
            obj.assigned_ngo == request.user or
            obj.assigned_volunteer == request.user or
            obj.donor == request.user
        )

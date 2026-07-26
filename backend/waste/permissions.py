from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsReporterOrReadOnly(BasePermission):
    """
    Object-level permission to only allow the creator of a report to edit/delete it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user


class CanAssignOrUpdateStatus(BasePermission):
    """
    Permission checking if user is Municipality, Volunteer, or Admin.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Admins, Municipalities, and Volunteers can update statuses or assign
        return request.user.role in ["ADMIN", "MUNICIPALITY", "VOLUNTEER"]


class IsCommentOwnerOrReadOnly(BasePermission):
    """
    Only the creator of a comment can delete or edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user

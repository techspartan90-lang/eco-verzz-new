from rest_framework.permissions import BasePermission


class IsImpactOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_authenticated and (obj.user == request.user or request.user.role == "ADMIN")

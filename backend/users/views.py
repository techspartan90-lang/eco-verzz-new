from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserProfileSerializer
from .permissions import IsSelf


class UserViewSet(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.ListModelMixin,
                  viewsets.GenericViewSet):
    queryset = User.objects.all().order_by("username")
    serializer_class = UserProfileSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update"]:
            return [IsAuthenticated(), IsSelf()]
        return [IsAuthenticated()]

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import EnvironmentalImpact
from .serializers import EnvironmentalImpactSerializer
from .permissions import IsImpactOwner
from .services import AnalyticsService

class EnvironmentalImpactViewSet(viewsets.ModelViewSet):
    queryset = EnvironmentalImpact.objects.all().order_by("-recorded_date")
    serializer_class = EnvironmentalImpactSerializer
    permission_classes = [IsAuthenticated, IsImpactOwner]

    def get_queryset(self):
        return EnvironmentalImpact.objects.filter(user=self.request.user).order_by("-recorded_date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        summary_data = AnalyticsService.get_user_cumulative_impact(request.user)
        return Response(summary_data, status=status.HTTP_200_OK)

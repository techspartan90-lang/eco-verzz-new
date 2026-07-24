from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError

from .models import RewardChest, DailyMission, Stamp
from .serializers import RewardChestSerializer, DailyMissionSerializer, StampSerializer
from .permissions import IsRewardOwner
from .services import RewardsService

class RewardChestViewSet(viewsets.ModelViewSet):
    queryset = RewardChest.objects.all().order_by("-created_at")
    serializer_class = RewardChestSerializer
    permission_classes = [IsAuthenticated, IsRewardOwner]

    def get_queryset(self):
        return RewardChest.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def open(self, request, pk=None):
        chest = self.get_object()
        try:
            RewardsService.open_chest(chest)
            return Response({"status": "Chest opened successfully.", "points": chest.points_reward, "xp": chest.xp_reward}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DailyMissionViewSet(viewsets.ModelViewSet):
    queryset = DailyMission.objects.all().order_by("-created_at")
    serializer_class = DailyMissionSerializer
    permission_classes = [IsAuthenticated, IsRewardOwner]

    def get_queryset(self):
        return DailyMission.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def claim(self, request, pk=None):
        mission = self.get_object()
        try:
            RewardsService.claim_mission_rewards(mission)
            return Response({"status": "Mission rewards claimed successfully."}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StampViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stamp.objects.all().order_by("-unlocked_at")
    serializer_class = StampSerializer
    permission_classes = [IsAuthenticated, IsRewardOwner]

    def get_queryset(self):
        return Stamp.objects.filter(user=self.request.user).order_by("-unlocked_at")

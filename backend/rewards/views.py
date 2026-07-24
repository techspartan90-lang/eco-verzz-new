from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.core.exceptions import ValidationError
from django.db import transaction

from .models import RewardChest, DailyMission, Stamp, Badge, UserBadge, Coupon, WalletTransaction
from .serializers import (
    RewardChestSerializer,
    DailyMissionSerializer,
    StampSerializer,
    BadgeSerializer,
    UserBadgeSerializer,
    CouponSerializer,
    WalletTransactionSerializer,
)
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


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_badges(self, request):
        user_badges = UserBadge.objects.filter(user=request.user).order_by("-unlocked_at")
        serializer = UserBadgeSerializer(user_badges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.filter(is_redeemed=False).order_by("-created_at")
    serializer_class = CouponSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def redeem(self, request, pk=None):
        coupon = self.get_object()
        user = request.user

        if coupon.is_redeemed:
            return Response({"detail": "This coupon has already been redeemed."}, status=status.HTTP_400_BAD_REQUEST)

        if user.reward_points < coupon.points_cost:
            return Response({"detail": f"Insufficient eco points. Required: {coupon.points_cost}, Available: {user.reward_points}"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user.reward_points -= coupon.points_cost
            user.save()

            coupon.is_redeemed = True
            coupon.redeemed_by = user
            coupon.save()

            WalletTransaction.objects.create(
                user=user,
                amount=coupon.points_cost,
                transaction_type="REDEEMED",
                description=f"Redeemed coupon: {coupon.title}"
            )

        return Response({
            "detail": "Coupon redeemed successfully!",
            "discount_code": coupon.discount_code,
            "remaining_points": user.reward_points
        }, status=status.HTTP_200_OK)


class WalletViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        transactions = WalletTransaction.objects.filter(user=user).order_by("-created_at")[:20]
        transaction_serializer = WalletTransactionSerializer(transactions, many=True)

        return Response({
            "reward_points": user.reward_points,
            "carbon_score": user.carbon_score,
            "recent_transactions": transaction_serializer.data
        }, status=status.HTTP_200_OK)

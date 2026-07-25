from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RewardChestViewSet,
    DailyMissionViewSet,
    StampViewSet,
    BadgeViewSet,
    CouponViewSet,
    WalletViewSet,
)

router = DefaultRouter()
router.register("chests", RewardChestViewSet, basename="chest")
router.register("missions", DailyMissionViewSet, basename="mission")
router.register("stamps", StampViewSet, basename="stamp")
router.register("badges", BadgeViewSet, basename="badge")
router.register("coupons", CouponViewSet, basename="coupon")
router.register("wallet", WalletViewSet, basename="wallet")

urlpatterns = [
    path("", include(router.urls)),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RewardChestViewSet, DailyMissionViewSet, StampViewSet

router = DefaultRouter()
router.register("chests", RewardChestViewSet, basename="chest")
router.register("missions", DailyMissionViewSet, basename="mission")
router.register("stamps", StampViewSet, basename="stamp")

urlpatterns = [
    path("", include(router.urls)),
]

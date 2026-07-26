from rest_framework.routers import DefaultRouter
from .views import WasteReportViewSet, WastePickupRequestViewSet, CollectionCenterViewSet

router = DefaultRouter()
router.register(r"reports", WasteReportViewSet, basename="waste")
router.register(r"pickups", WastePickupRequestViewSet, basename="waste-pickups")
router.register(r"centers", CollectionCenterViewSet, basename="waste-centers")

urlpatterns = router.urls

from rest_framework.routers import DefaultRouter
from .views import FoodDonationViewSet, FoodRequestViewSet

router = DefaultRouter()
router.register(r"donations", FoodDonationViewSet, basename="food")
router.register(r"requests", FoodRequestViewSet, basename="food-requests")

urlpatterns = router.urls

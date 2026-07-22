from rest_framework.routers import DefaultRouter
from .views import FoodDonationViewSet

router = DefaultRouter()
router.register(r"donations", FoodDonationViewSet, basename="food")

urlpatterns = router.urls

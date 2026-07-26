from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, WishlistViewSet, VendorProfileViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"wishlist", WishlistViewSet, basename="wishlist")
router.register(r"vendors", VendorProfileViewSet, basename="vendor")

urlpatterns = router.urls

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIScanViewSet

router = DefaultRouter()
router.register("scans", AIScanViewSet, basename="scan")

urlpatterns = [
    path("", include(router.urls)),
]

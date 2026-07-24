from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnvironmentalImpactViewSet

router = DefaultRouter()
router.register("impacts", EnvironmentalImpactViewSet, basename="impact")

urlpatterns = [
    path("", include(router.urls)),
]

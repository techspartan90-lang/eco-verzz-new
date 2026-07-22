from rest_framework.routers import DefaultRouter
from .views import WasteReportViewSet

router = DefaultRouter()
router.register(r"reports", WasteReportViewSet, basename="waste")

urlpatterns = router.urls
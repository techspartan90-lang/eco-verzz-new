from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, CampaignViewSet

router = DefaultRouter()
router.register("posts", PostViewSet, basename="post")
router.register("comments", CommentViewSet, basename="comment")
router.register("campaigns", CampaignViewSet, basename="campaign")

urlpatterns = [
    path("", include(router.urls)),
]

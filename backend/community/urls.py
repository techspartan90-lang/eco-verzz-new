from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, CampaignViewSet, CommunityGroupViewSet, VolunteerActivityViewSet

router = DefaultRouter()
router.register("posts", PostViewSet, basename="post")
router.register("comments", CommentViewSet, basename="comment")
router.register("campaigns", CampaignViewSet, basename="campaign")
router.register("groups", CommunityGroupViewSet, basename="community-groups")
router.register("activities", VolunteerActivityViewSet, basename="community-activities")

urlpatterns = [
    path("", include(router.urls)),
]

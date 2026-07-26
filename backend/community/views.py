from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from users.models import User

from .models import Post, Comment, Campaign, CommunityGroup, VolunteerActivity
from .serializers import (
    PostSerializer,
    CommentSerializer,
    CampaignSerializer,
    CommunityGroupSerializer,
    VolunteerActivitySerializer,
)
from .permissions import IsAuthorOrReadOnly, IsOrganizerOrReadOnly
from .services import CommunityService


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        liked, likes_count = CommunityService.toggle_like(post, request.user)
        return Response({"liked": liked, "likes_count": likes_count}, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by("-created_at")
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all().order_by("-start_time")
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOrganizerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        campaign = self.get_object()
        joined, participants_count = CommunityService.toggle_join_campaign(
            campaign, request.user)
        return Response({"joined": joined, "participants_count": participants_count}, status=status.HTTP_200_OK)


class CommunityGroupViewSet(viewsets.ModelViewSet):
    queryset = CommunityGroup.objects.all().order_by("-created_at")
    serializer_class = CommunityGroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        group = serializer.save(creator=self.request.user)
        group.members.add(self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        group = self.get_object()
        if request.user in group.members.all():
            group.members.remove(request.user)
            joined = False
        else:
            group.members.add(request.user)
            joined = True
        return Response({"joined": joined, "members_count": group.members.count()}, status=status.HTTP_200_OK)


class VolunteerActivityViewSet(viewsets.ModelViewSet):
    queryset = VolunteerActivity.objects.all().order_by("-activity_date")
    serializer_class = VolunteerActivitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        activity = self.get_object()
        if request.user in activity.volunteers.all():
            activity.volunteers.remove(request.user)
            joined = False
        else:
            activity.volunteers.add(request.user)
            joined = True
            # Award volunteer carbon score increment
            request.user.carbon_score += activity.hours_credited * 5.0
            request.user.reward_points += int(activity.hours_credited * 10)
            request.user.save()

        return Response({"joined": joined, "volunteers_count": activity.volunteers.count()}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticatedOrReadOnly])
    def leaderboard(self, request):
        top_users = User.objects.all().order_by("-reward_points", "-carbon_score")[:20]
        data = [
            {
                "username": u.username,
                "role": u.role,
                "reward_points": u.reward_points,
                "carbon_score": u.carbon_score,
            }
            for u in top_users
        ]
        return Response(data, status=status.HTTP_200_OK)

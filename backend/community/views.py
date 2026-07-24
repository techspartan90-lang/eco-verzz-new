from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from .models import Post, Comment, Campaign
from .serializers import PostSerializer, CommentSerializer, CampaignSerializer
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
        joined, participants_count = CommunityService.toggle_join_campaign(campaign, request.user)
        return Response({"joined": joined, "participants_count": participants_count}, status=status.HTTP_200_OK)

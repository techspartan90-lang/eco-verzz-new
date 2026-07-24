from rest_framework import serializers
from .models import Post, Comment, Campaign
from .validators import validate_post_content

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "post", "username", "content", "created_at"]
        read_only_fields = ["id", "username", "created_at"]


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    content = serializers.CharField(validators=[validate_post_content])

    class Meta:
        model = Post
        fields = ["id", "username", "category", "content", "likes_count", "comments", "created_at"]
        read_only_fields = ["id", "username", "likes_count", "comments", "created_at"]


class CampaignSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source="organizer.username", read_only=True)
    participants_count = serializers.IntegerField(source="participants.count", read_only=True)

    class Meta:
        model = Campaign
        fields = ["id", "title", "description", "location", "start_time", "organizer_name", "participants_count", "created_at"]
        read_only_fields = ["id", "organizer_name", "participants_count", "created_at"]

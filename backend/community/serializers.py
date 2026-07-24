from rest_framework import serializers
from .models import Post, Comment, Campaign, CommunityGroup, VolunteerActivity
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


class CommunityGroupSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source="creator.username", read_only=True)
    members_count = serializers.IntegerField(source="members.count", read_only=True)

    class Meta:
        model = CommunityGroup
        fields = ["id", "name", "description", "creator_name", "members_count", "created_at"]
        read_only_fields = ["id", "creator_name", "members_count", "created_at"]


class VolunteerActivitySerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source="organizer.username", read_only=True)
    volunteers_count = serializers.IntegerField(source="volunteers.count", read_only=True)

    class Meta:
        model = VolunteerActivity
        fields = ["id", "title", "description", "hours_credited", "organizer_name", "volunteers_count", "activity_date", "created_at"]
        read_only_fields = ["id", "organizer_name", "volunteers_count", "created_at"]

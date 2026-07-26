from rest_framework import serializers
from users.models import User
from .models import (
    WasteReport,
    WasteReportTimeline,
    WasteReportComment,
    WasteReportRating,
    WastePickupRequest,
    CollectionCenter,
)
from .validators import validate_image_size, validate_rating_value


class WasteReportTimelineSerializer(serializers.ModelSerializer):
    changed_by_username = serializers.CharField(
        source="changed_by.username", read_only=True)

    class Meta:
        model = WasteReportTimeline
        fields = [
            "id",
            "status",
            "changed_by",
            "changed_by_username",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "changed_by", "created_at"]


class WasteReportCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = WasteReportComment
        fields = [
            "id",
            "user",
            "username",
            "content",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]


class WasteReportRatingSerializer(serializers.ModelSerializer):
    citizen_username = serializers.CharField(source="citizen.username", read_only=True)
    rating = serializers.IntegerField(validators=[validate_rating_value])

    class Meta:
        model = WasteReportRating
        fields = [
            "id",
            "citizen",
            "citizen_username",
            "rating",
            "feedback",
            "created_at",
        ]
        read_only_fields = ["id", "citizen", "created_at"]


class WasteReportSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    assigned_municipality_username = serializers.CharField(
        source="assigned_municipality.username", read_only=True)
    assigned_volunteer_username = serializers.CharField(
        source="assigned_volunteer.username", read_only=True)

    image = serializers.ImageField(
        validators=[validate_image_size], required=False, allow_null=True)
    before_image = serializers.ImageField(read_only=True)
    after_image = serializers.ImageField(
        validators=[validate_image_size], required=False, allow_null=True)

    timeline = WasteReportTimelineSerializer(many=True, read_only=True)
    comments = WasteReportCommentSerializer(many=True, read_only=True)
    rating = WasteReportRatingSerializer(read_only=True)

    class Meta:
        model = WasteReport
        fields = [
            "id",
            "report_number",
            "user",
            "user_username",
            "title",
            "description",
            "category",
            "priority",
            "location",
            "latitude",
            "longitude",
            "image",
            "before_image",
            "after_image",
            "status",
            "assigned_municipality",
            "assigned_municipality_username",
            "assigned_volunteer",
            "assigned_volunteer_username",
            "ai_metadata",
            "timeline",
            "comments",
            "rating",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "report_number",
            "user",
            "before_image",
            "after_image",
            "status",
            "assigned_municipality",
            "assigned_volunteer",
            "ai_metadata",
            "timeline",
            "comments",
            "rating",
            "created_at",
            "updated_at",
        ]


class MunicipalityAssignmentSerializer(serializers.Serializer):
    municipality_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="MUNICIPALITY")
    )
    notes = serializers.CharField(required=False, allow_blank=True)


class VolunteerAssignmentSerializer(serializers.Serializer):
    volunteer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="VOLUNTEER")
    )
    notes = serializers.CharField(required=False, allow_blank=True)


class CompleteCleanupSerializer(serializers.Serializer):
    after_image = serializers.ImageField(validators=[validate_image_size])
    notes = serializers.CharField(required=False, allow_blank=True)


class WastePickupRequestSerializer(serializers.ModelSerializer):
    requester_username = serializers.CharField(
        source="requester.username", read_only=True)
    recycler_username = serializers.CharField(
        source="assigned_recycler.username", read_only=True)

    class Meta:
        model = WastePickupRequest
        fields = [
            "id",
            "report",
            "requester",
            "requester_username",
            "assigned_recycler",
            "recycler_username",
            "scheduled_date",
            "status",
            "category",
            "address",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "requester",
                            "assigned_recycler", "status", "created_at"]


class CollectionCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionCenter
        fields = [
            "id",
            "name",
            "address",
            "latitude",
            "longitude",
            "accepted_categories",
            "contact_number",
            "operating_hours",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

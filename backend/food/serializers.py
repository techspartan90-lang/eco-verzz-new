from rest_framework import serializers
from users.models import User
from .models import FoodDonation, FoodDonationTimeline, FoodRequest
from .validators import validate_expiry_time
from authentication.validators import validate_latitude, validate_longitude


class FoodDonationTimelineSerializer(serializers.ModelSerializer):
    changed_by_username = serializers.CharField(
        source="changed_by.username", read_only=True)

    class Meta:
        model = FoodDonationTimeline
        fields = [
            "id",
            "status",
            "changed_by",
            "changed_by_username",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "changed_by", "created_at"]


class FoodDonationSerializer(serializers.ModelSerializer):
    donor_username = serializers.CharField(source="donor.username", read_only=True)
    assigned_ngo_username = serializers.CharField(
        source="assigned_ngo.username", read_only=True)
    assigned_volunteer_username = serializers.CharField(
        source="assigned_volunteer.username", read_only=True)

    latitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, validators=[validate_latitude])
    longitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, validators=[validate_longitude])
    expiry_time = serializers.DateTimeField(validators=[validate_expiry_time])
    is_expired = serializers.BooleanField(read_only=True)

    timeline = FoodDonationTimelineSerializer(many=True, read_only=True)

    class Meta:
        model = FoodDonation
        fields = [
            "id",
            "donor",
            "donor_username",
            "title",
            "description",
            "food_type",
            "quantity",
            "quality_status",
            "expiry_time",
            "is_expired",
            "pickup_address",
            "latitude",
            "longitude",
            "status",
            "assigned_ngo",
            "assigned_ngo_username",
            "assigned_volunteer",
            "assigned_volunteer_username",
            "qr_code_token",
            "timeline",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "donor",
            "status",
            "assigned_ngo",
            "assigned_volunteer",
            "qr_code_token",
            "timeline",
            "created_at",
            "updated_at",
        ]


class ClaimDonationSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True)


class AssignVolunteerSerializer(serializers.Serializer):
    volunteer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="VOLUNTEER")
    )
    notes = serializers.CharField(required=False, allow_blank=True)


class UpdatePickupStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=[("PICKED_UP", "Picked Up"), ("DELIVERED",
                                              "Delivered"), ("CANCELLED", "Cancelled")]
    )
    notes = serializers.CharField(required=False, allow_blank=True)
    qr_code_token = serializers.CharField(required=False, allow_blank=True)


class FoodRequestSerializer(serializers.ModelSerializer):
    ngo_username = serializers.CharField(source="ngo.username", read_only=True)

    class Meta:
        model = FoodRequest
        fields = [
            "id",
            "ngo",
            "ngo_username",
            "title",
            "description",
            "quantity_needed",
            "food_type",
            "is_fulfilled",
            "created_at",
        ]
        read_only_fields = ["id", "ngo", "created_at"]

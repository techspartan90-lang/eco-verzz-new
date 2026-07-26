from rest_framework import serializers
from .models import User
from .validators import validate_phone_number


class UserProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        validators=[validate_phone_number], required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "role", "full_name", "phone",
            "profile_image", "address", "city", "state", "country",
            "latitude", "longitude", "reward_points", "carbon_score",
            "achievements", "is_verified", "date_joined"
        ]
        read_only_fields = ["id", "username", "email", "role", "reward_points",
                            "carbon_score", "achievements", "is_verified", "date_joined"]

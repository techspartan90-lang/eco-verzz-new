from rest_framework import serializers
from .models import AIScan

class AIScanSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = AIScan
        fields = [
            "id", "username", "image", "predicted_category",
            "confidence", "points_awarded", "co2_offset", "created_at"
        ]
        read_only_fields = ["predicted_category", "confidence", "points_awarded", "co2_offset", "created_at"]

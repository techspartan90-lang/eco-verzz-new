from rest_framework import serializers
from .models import EnvironmentalImpact


class EnvironmentalImpactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentalImpact
        fields = "__all__"
        read_only_fields = ["id", "user", "recorded_date"]

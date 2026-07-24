from rest_framework import serializers
from .models import RewardChest, DailyMission, Stamp

class RewardChestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardChest
        fields = "__all__"
        read_only_fields = ["id", "user", "is_opened", "points_reward", "xp_reward", "created_at"]

class DailyMissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyMission
        fields = "__all__"
        read_only_fields = ["id", "user", "is_completed", "is_claimed", "created_at"]

class StampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stamp
        fields = "__all__"
        read_only_fields = ["id", "user", "unlocked_at"]

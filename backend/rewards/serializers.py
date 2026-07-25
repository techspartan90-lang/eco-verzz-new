from rest_framework import serializers
from .models import RewardChest, DailyMission, Stamp, Badge, UserBadge, Coupon, WalletTransaction

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


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = "__all__"


class UserBadgeSerializer(serializers.ModelSerializer):
    badge_name = serializers.CharField(source="badge.name", read_only=True)
    badge_emoji = serializers.CharField(source="badge.icon_emoji", read_only=True)
    badge_description = serializers.CharField(source="badge.description", read_only=True)

    class Meta:
        model = UserBadge
        fields = ["id", "user", "badge", "badge_name", "badge_emoji", "badge_description", "unlocked_at"]
        read_only_fields = ["id", "user", "unlocked_at"]


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ["id", "title", "partner_vendor", "points_cost", "discount_code", "is_redeemed", "created_at"]
        read_only_fields = ["id", "discount_code", "is_redeemed", "created_at"]


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ["id", "user", "amount", "transaction_type", "description", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

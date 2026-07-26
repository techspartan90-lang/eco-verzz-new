from django.contrib import admin
from .models import RewardChest, DailyMission, Stamp


@admin.register(RewardChest)
class RewardChestAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "chest_type", "is_opened",
                    "points_reward", "created_at")


@admin.register(DailyMission)
class DailyMissionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "current_progress",
                    "required_progress", "is_completed", "is_claimed")


@admin.register(Stamp)
class StampAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "emoji", "unlocked_at")

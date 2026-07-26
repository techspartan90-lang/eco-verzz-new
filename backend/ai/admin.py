from django.contrib import admin
from .models import AIScan


@admin.register(AIScan)
class AIScanAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "predicted_category", "confidence",
                    "points_awarded", "co2_offset", "created_at")
    list_filter = ("predicted_category", "created_at")
    search_fields = ("user__username", "predicted_category")

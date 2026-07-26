from django.contrib import admin
from .models import EnvironmentalImpact


@admin.register(EnvironmentalImpact)
class EnvironmentalImpactAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "co2_saved", "waste_diverted",
                    "food_saved", "recorded_date")
    list_filter = ("recorded_date",)
    search_fields = ("user__username",)

from django.contrib import admin
from .models import WasteReport


@admin.register(WasteReport)
class WasteReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "category",
        "status",
        "user",
        "created_at",
    )

    list_filter = (
        "status",
        "category",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "location",
    )

    ordering = ("-created_at",)
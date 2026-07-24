from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "action", "ip_address", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("user__username", "user__email", "action", "ip_address")
    readonly_fields = ("user", "action", "ip_address", "user_agent", "details", "created_at")

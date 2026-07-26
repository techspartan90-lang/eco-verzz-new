from django.contrib import admin
from .models import Post, Comment, Campaign


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "category", "created_at")
    search_fields = ("user__username", "content", "category")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "user", "created_at")
    search_fields = ("user__username", "content")


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "location", "start_time", "organizer")
    search_fields = ("title", "location", "organizer__username")

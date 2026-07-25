from django.db import models
from django.conf import settings

class RewardChest(models.Model):
    CHEST_TYPES = [
        ("DAILY", "Daily Leaf Chest"),
        ("EPIC", "Epic Marine Chest"),
        ("COSMIC", "Cosmic Biosphere Chest")
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chests")
    chest_type = models.CharField(max_length=20, choices=CHEST_TYPES, default="DAILY")
    is_opened = models.BooleanField(default=False)
    points_reward = models.IntegerField(default=100)
    xp_reward = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.chest_type} (Opened: {self.is_opened})"


class DailyMission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="daily_missions")
    title = models.CharField(max_length=200)
    required_progress = models.IntegerField(default=2)
    current_progress = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    is_claimed = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.current_progress}/{self.required_progress})"


class Stamp(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="stamps")
    name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.name} Stamp"


class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_emoji = models.CharField(max_length=10, default="🏆")
    category = models.CharField(max_length=50, default="GENERAL")

    def __str__(self):
        return f"Badge: {self.name}"


class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "badge")

    def __str__(self):
        return f"{self.user.username} unlocked {self.badge.name}"


class Coupon(models.Model):
    title = models.CharField(max_length=200)
    partner_vendor = models.CharField(max_length=200)
    points_cost = models.IntegerField(default=100)
    discount_code = models.CharField(max_length=50)
    is_redeemed = models.BooleanField(default=False)
    redeemed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="redeemed_coupons"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Coupon: {self.title} ({self.partner_vendor})"


class WalletTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("EARNED", "Points Earned"),
        ("REDEEMED", "Points Redeemed"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet_transactions")
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} {self.amount} pts ({self.description})"

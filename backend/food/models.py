import uuid
from django.db import models
from django.conf import settings
from .validators import validate_expiry_time


class FoodDonation(models.Model):
    FOOD_TYPE_CHOICES = [
        ("COOKED", "Cooked Meals"),
        ("PACKAGED", "Packaged Food"),
        ("RAW_INGREDIENTS", "Raw Ingredients"),
        ("FRUITS_VEG", "Fruits & Vegetables"),
        ("OTHER", "Other"),
    ]

    QUALITY_CHOICES = [
        ("EXCELLENT", "Excellent (Freshly made / Long shelf life)"),
        ("GOOD", "Good (Safe to consume, short shelf life)"),
        ("FAIR", "Fair (Must consume immediately)"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending Claim"),
        ("ACCEPTED", "Claimed by NGO"),
        ("ASSIGNED", "Assigned to Volunteer"),
        ("PICKED_UP", "Picked Up"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="food_donations"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    food_type = models.CharField(
        max_length=20,
        choices=FOOD_TYPE_CHOICES,
        default="COOKED"
    )

    quantity = models.CharField(
        max_length=100,
        help_text="E.g. '10 kg', '20 plates', '5 boxes'"
    )

    quality_status = models.CharField(
        max_length=20,
        choices=QUALITY_CHOICES,
        default="GOOD"
    )

    expiry_time = models.DateTimeField(
        validators=[validate_expiry_time]
    )

    pickup_address = models.TextField()
    
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )
    
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    assigned_ngo = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ngo_claimed_donations"
    )

    assigned_volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="volunteer_pickup_donations"
    )

    qr_code_token = models.CharField(
        max_length=64,
        default=uuid.uuid4,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expiry_time

    def __str__(self):
        return f"{self.title} ({self.quantity}) - {self.status}"


class FoodDonationTimeline(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    donation = models.ForeignKey(
        FoodDonation,
        on_delete=models.CASCADE,
        related_name="timeline"
    )
    
    status = models.CharField(
        max_length=20,
        choices=FoodDonation.STATUS_CHOICES
    )
    
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation {self.donation.id} -> {self.status} at {self.created_at}"


class FoodRequest(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    ngo = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_food_requests"
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    quantity_needed = models.CharField(max_length=100)
    food_type = models.CharField(
        max_length=20,
        choices=FoodDonation.FOOD_TYPE_CHOICES,
        default="COOKED"
    )
    is_fulfilled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Food Request #{self.id}: {self.title} by {self.ngo.username}"

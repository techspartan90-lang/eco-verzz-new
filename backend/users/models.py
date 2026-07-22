from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("MUNICIPALITY", "Municipality"),
        ("CITIZEN", "Citizen"),
        ("NGO", "NGO"),
        ("RESTAURANT", "Restaurant"),
        ("VOLUNTEER", "Volunteer"),
        ("RECYCLER", "Recycler"),
        ("VENDOR", "Vendor"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="CITIZEN")
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    reward_points = models.IntegerField(default=0)
    carbon_score = models.FloatField(default=0.0)
    achievements = models.JSONField(default=list, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
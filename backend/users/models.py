from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("CITIZEN", "Citizen"),
        ("NGO", "NGO"),
        ("BUSINESS", "Business"),
        ("GOVERNMENT", "Government"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="CITIZEN")
    phone = models.CharField(max_length=15, blank=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    address = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
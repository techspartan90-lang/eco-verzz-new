from django.db import models
from users.models import User

class Product(models.Model):
    CATEGORY_CHOICES = [
        ("PLASTIC", "Plastic"),
        ("METAL", "Metal"),
        ("GLASS", "Glass"),
        ("PAPER", "Paper"),
        ("E_WASTE", "E-Waste"),
        ("ORGANIC", "Organic"),
        ("OTHER", "Other"),
    ]

    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="products"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(default=1)

    location = models.CharField(max_length=255)

    image = models.ImageField(
        upload_to="marketplace/",
        blank=True,
        null=True
    )

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
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


class ProductReview(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="product_reviews"
    )
    rating = models.IntegerField()  # 1-5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} ({self.rating}/5) for {self.product.title}"


class Wishlist(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="wishlist"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="wished_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user.username} -> {self.product.title}"


class VendorProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="vendor_profile"
    )
    company_name = models.CharField(max_length=200)
    business_registration_no = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(default=5.0)
    total_sales = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Vendor Profile: {self.company_name} ({self.user.username})"

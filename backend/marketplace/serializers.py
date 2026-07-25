from rest_framework import serializers
from .models import Product, ProductReview, Wishlist, VendorProfile

class ProductReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ProductReview
        fields = ["id", "product", "user", "username", "rating", "comment", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.username", read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "seller",
            "seller_name",
            "title",
            "description",
            "category",
            "price",
            "quantity",
            "location",
            "image",
            "is_available",
            "reviews",
            "average_rating",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "seller", "created_at", "updated_at"]

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 5.0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class WishlistSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="product.title", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "user", "product", "product_title", "product_price", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


class VendorProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = VendorProfile
        fields = ["id", "user", "username", "company_name", "business_registration_no", "rating", "total_sales", "created_at"]
        read_only_fields = ["id", "user", "rating", "total_sales", "created_at"]
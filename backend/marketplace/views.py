from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.core.exceptions import ValidationError
from django.db import models

from .models import Product, ProductReview, Wishlist, VendorProfile
from .serializers import (
    ProductSerializer,
    ProductReviewSerializer,
    WishlistSerializer,
    VendorProfileSerializer,
)
from .permissions import IsSellerOrReadOnly
from .services import MarketplaceService

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_available=True).order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.all().order_by("-created_at")
        
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category.upper())

        available_only = self.request.query_params.get("available")
        if available_only == "true":
            queryset = queryset.filter(is_available=True)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search) |
                models.Q(location__icontains=search)
            )

        min_price = self.request.query_params.get("min_price")
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))

        max_price = self.request.query_params.get("max_price")
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))

        return queryset

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def buy(self, request, pk=None):
        product = self.get_object()
        try:
            MarketplaceService.buy_product(product, request.user)
            return Response({"status": "Product purchased successfully."}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def review(self, request, pk=None):
        product = self.get_object()
        serializer = ProductReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save(product=product, user=request.user)
        return Response(ProductReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all().order_by("-created_at")
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class VendorProfileViewSet(viewsets.ModelViewSet):
    queryset = VendorProfile.objects.all().order_by("-created_at")
    serializer_class = VendorProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get", "put", "patch"], permission_classes=[IsAuthenticated])
    def me(self, request):
        profile, created = VendorProfile.objects.get_or_create(
            user=request.user,
            defaults={"company_name": f"{request.user.username}'s Store"}
        )
        if request.method in ["PUT", "PATCH"]:
            serializer = self.get_serializer(profile, data=request.data, partial=(request.method == "PATCH"))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(self.get_serializer(profile).data, status=status.HTTP_200_OK)
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.core.exceptions import ValidationError

from .models import Product
from .serializers import ProductSerializer
from .permissions import IsSellerOrReadOnly
from .services import MarketplaceService

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_available=True).order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

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
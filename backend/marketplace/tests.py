from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from marketplace.models import Product

User = get_user_model()

class MarketplaceTests(APITestCase):
    def setUp(self):
        self.seller = User.objects.create_user(
            username="seller_user",
            email="seller@test.com",
            password="testpassword123",
            role="VENDOR"
        )
        self.buyer = User.objects.create_user(
            username="buyer_user",
            email="buyer@test.com",
            password="testpassword123",
            role="CITIZEN",
            reward_points=500
        )
        self.product = Product.objects.create(
            seller=self.seller,
            title="Eco Bamboo Straws",
            description="Biodegradable bamboo straws.",
            category="OTHER",
            price=150.00,
            quantity=5
        )
        self.list_url = reverse("product-list")
        self.buy_url = reverse("product-buy", kwargs={"pk": self.product.pk})

    def test_list_products(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_buy_product_success(self):
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.buy_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify state
        self.buyer.refresh_from_db()
        self.seller.refresh_from_db()
        self.product.refresh_from_db()
        self.assertEqual(self.buyer.reward_points, 350) # 500 - 150
        self.assertEqual(self.seller.reward_points, 150)
        self.assertEqual(self.product.quantity, 4)

    def test_buy_product_insufficient_points(self):
        poor_buyer = User.objects.create_user(
            username="poor_buyer",
            email="poor@test.com",
            password="testpassword123",
            role="CITIZEN",
            reward_points=50
        )
        self.client.force_authenticate(user=poor_buyer)
        response = self.client.post(self.buy_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Insufficient", response.data["error"])

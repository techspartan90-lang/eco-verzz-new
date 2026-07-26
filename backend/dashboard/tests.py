from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class DashboardTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="dash_user",
            email="dash@test.com",
            password="testpassword123",
            role="CITIZEN"
        )
        self.dash_url = reverse("dashboard-metrics")

    def test_get_dashboard_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.dash_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], "CITIZEN")
        self.assertIn("my_waste_reports", response.data["stats"])

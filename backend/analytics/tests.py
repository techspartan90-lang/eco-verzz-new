from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from analytics.models import EnvironmentalImpact

User = get_user_model()

class AnalyticsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="analytics_user",
            email="analytics@test.com",
            password="testpassword123",
            role="CITIZEN"
        )
        EnvironmentalImpact.objects.create(
            user=self.user,
            co2_saved=2.5,
            waste_diverted=10.0,
            food_saved=5.0
        )
        EnvironmentalImpact.objects.create(
            user=self.user,
            co2_saved=1.5,
            waste_diverted=5.0,
            food_saved=2.0
        )
        self.summary_url = reverse("impact-summary")

    def test_impact_summary(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.summary_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["co2_saved"], 4.0)
        self.assertEqual(response.data["waste_diverted"], 15.0)
        self.assertEqual(response.data["food_saved"], 7.0)

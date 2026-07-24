from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class CommonTests(APITestCase):
    def test_health_check(self):
        url = reverse("health-check")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "healthy")

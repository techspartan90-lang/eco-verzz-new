from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()


class AITestCases(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="aiscan_user",
            email="aiscan@test.com",
            password="testpassword123",
            role="CITIZEN"
        )
        self.scan_url = reverse("scan-list")

    def test_scan_unauthenticated_fails(self):
        response = self.client.post(self.scan_url, {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("requests.post")
    def test_scan_success(self, mock_post):

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "category": "PLASTIC",
            "confidence": 0.92,
            "points": 40,
            "co2_offset": 0.25,
            "message": "Detected PET Plastic Bottle"
        }
        mock_post.return_value = mock_response

        self.client.force_authenticate(user=self.user)

        # Create a mock image file
        image_content = b"fakeimagebinarydata"
        mock_image = SimpleUploadedFile(
            name="plastic_bottle.png",
            content=image_content,
            content_type="image/png"
        )

        response = self.client.post(
            self.scan_url,
            {"image": mock_image},
            format="multipart"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["predicted_category"], "PLASTIC")
        self.assertEqual(response.data["points_awarded"], 40)

        # Verify points awarded to user
        self.user.refresh_from_db()
        self.assertEqual(self.user.reward_points, 40)
        self.assertEqual(self.user.carbon_score, 0.25)

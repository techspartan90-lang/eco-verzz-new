from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from authentication.services import EmailVerificationService, PasswordResetService


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.profile_url = reverse("profile")
        self.verify_email_url = reverse("verify-email")
        self.password_reset_url = reverse("password-reset")
        self.password_reset_confirm_url = reverse("password-reset-confirm")

        self.user_data = {
            "username": "testcitizen",
            "email": "citizen@test.com",
            "password": "testpassword123",
            "full_name": "Test Citizen",
            "phone": "+1234567890",
            "role": "CITIZEN",
            "address": "123 Green Street",
            "city": "Eco City",
            "state": "Green State",
            "country": "EcoLand",
            "latitude": 37.774900,
            "longitude": -122.419400,
        }

    def test_user_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testcitizen").exists())
        user = User.objects.get(username="testcitizen")
        self.assertEqual(user.role, "CITIZEN")
        self.assertEqual(user.full_name, "Test Citizen")
        self.assertFalse(user.is_verified)

    def test_user_registration_invalid_phone(self):
        bad_data = self.user_data.copy()
        bad_data["phone"] = "not-a-number-12345"
        response = self.client.post(self.register_url, bad_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone", response.data)

    def test_user_registration_invalid_coordinates(self):
        bad_data = self.user_data.copy()
        bad_data["latitude"] = 150.00  # Latitude must be <= 90
        response = self.client.post(self.register_url, bad_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("latitude", response.data)

    def test_login_success(self):
        # Register user first
        User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"],
            role=self.user_data["role"]
        )

        login_data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"]
        }
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_profile_retrieval_and_update(self):
        user = User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"],
            role=self.user_data["role"]
        )
        # Authenticate
        self.client.force_authenticate(user=user)

        # GET Profile
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], user.username)

        # PATCH Profile
        update_data = {"full_name": "Updated Citizen Name", "phone": "+9876543210"}
        response = self.client.patch(self.profile_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.full_name, "Updated Citizen Name")
        self.assertEqual(user.phone, "+9876543210")

    def test_email_verification_flow(self):
        user = User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )
        self.assertFalse(user.is_verified)

        uid, token = EmailVerificationService.generate_verification_token(user)

        # Verify via API
        response = self.client.get(
            f"{self.verify_email_url}?uid={uid}&token={token}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_verified)

    def test_password_reset_flow(self):
        user = User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )

        # Request reset
        response = self.client.post(
            self.password_reset_url,
            {"email": user.email},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        uid, token = PasswordResetService.generate_reset_token(user)

        # Confirm reset
        reset_confirm_data = {
            "uid": uid,
            "token": token,
            "new_password": "brandnewpassword999"
        }
        response = self.client.post(
            self.password_reset_confirm_url,
            reset_confirm_data,
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify login with new password
        login_data = {
            "username": user.username,
            "password": "brandnewpassword999"
        }
        login_response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

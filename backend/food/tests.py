from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from .models import FoodDonation, FoodDonationTimeline


class FoodTests(APITestCase):
    def setUp(self):
        # Create users
        self.citizen = User.objects.create_user(
            username="citizen_donor",
            email="donor@test.com",
            password="testpassword123",
            role="CITIZEN"
        )
        self.ngo = User.objects.create_user(
            username="ngo_recipient",
            email="ngo@test.com",
            password="testpassword123",
            role="NGO"
        )
        self.volunteer = User.objects.create_user(
            username="volunteer_driver",
            email="volunteer@test.com",
            password="testpassword123",
            role="VOLUNTEER"
        )
        self.other_ngo = User.objects.create_user(
            username="other_ngo",
            email="other_ngo@test.com",
            password="testpassword123",
            role="NGO"
        )

        # Donation data
        self.expiry_future = timezone.now() + timedelta(hours=6)
        self.donation_data = {
            "title": "Fresh Pizza Buffet Surplus",
            "description": "5 whole boxes of veggie pizza, untouched.",
            "food_type": "COOKED",
            "quantity": "5 boxes",
            "quality_status": "EXCELLENT",
            "expiry_time": self.expiry_future,
            "pickup_address": "456 Pizzeria Lane",
            "latitude": 37.774900,
            "longitude": -122.419400,
        }

    def test_create_food_donation_success(self):
        self.client.force_authenticate(user=self.citizen)
        url = reverse("food-list")
        response = self.client.post(url, self.donation_data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(FoodDonation.objects.filter(title="Fresh Pizza Buffet Surplus").exists())
        
        donation = FoodDonation.objects.get(title="Fresh Pizza Buffet Surplus")
        self.assertEqual(donation.donor, self.citizen)
        self.assertEqual(donation.status, "PENDING")
        
        # Verify timeline log
        self.assertTrue(FoodDonationTimeline.objects.filter(donation=donation, status="PENDING").exists())

    def test_create_food_donation_invalid_expiry(self):
        self.client.force_authenticate(user=self.citizen)
        bad_data = self.donation_data.copy()
        bad_data["expiry_time"] = timezone.now() - timedelta(hours=1) # Expiry in past

        url = reverse("food-list")
        response = self.client.post(url, bad_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("expiry_time", response.data)

    def test_claim_donation(self):
        donation = FoodDonation.objects.create(
            donor=self.citizen,
            title="Raw Rice Bags",
            description="10 bags of white rice",
            food_type="RAW_INGREDIENTS",
            quantity="10 bags",
            expiry_time=self.expiry_future,
            latitude=37.774900,
            longitude=-122.419400
        )

        self.client.force_authenticate(user=self.ngo)
        url = reverse("food-claim", args=[donation.id])
        
        response = self.client.post(url, {"notes": "We will distribute this to local shelters."}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        donation.refresh_from_db()
        self.assertEqual(donation.assigned_ngo, self.ngo)
        self.assertEqual(donation.status, "ACCEPTED")
        
        # Verify timeline log
        self.assertTrue(FoodDonationTimeline.objects.filter(donation=donation, status="ACCEPTED").exists())

    def test_assign_volunteer(self):
        donation = FoodDonation.objects.create(
            donor=self.citizen,
            title="Fresh Salads",
            description="15 packages of mixed salad",
            food_type="FRUITS_VEG",
            quantity="15 packs",
            expiry_time=self.expiry_future,
            latitude=37.774900,
            longitude=-122.419400,
            status="ACCEPTED",
            assigned_ngo=self.ngo
        )

        # Other NGO tries to assign volunteer (should fail)
        self.client.force_authenticate(user=self.other_ngo)
        url = reverse("food-assign-volunteer", args=[donation.id])
        response = self.client.post(url, {"volunteer_id": self.volunteer.id}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Claiming NGO assigns volunteer (should pass)
        self.client.force_authenticate(user=self.ngo)
        response = self.client.post(url, {"volunteer_id": self.volunteer.id, "notes": "Please hurry."}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        donation.refresh_from_db()
        self.assertEqual(donation.assigned_volunteer, self.volunteer)
        self.assertEqual(donation.status, "ASSIGNED")

    def test_complete_delivery_and_rewards(self):
        donation = FoodDonation.objects.create(
            donor=self.citizen,
            title="Sandwiches",
            description="20 turkey sandwiches",
            food_type="COOKED",
            quantity="20 pack",
            expiry_time=self.expiry_future,
            latitude=37.774900,
            longitude=-122.419400,
            status="ASSIGNED",
            assigned_ngo=self.ngo,
            assigned_volunteer=self.volunteer
        )

        # Volunteer updates status to DELIVERED
        self.client.force_authenticate(user=self.volunteer)
        url = reverse("food-update-status", args=[donation.id])
        
        response = self.client.post(url, {"status": "DELIVERED", "notes": "Successfully delivered to shelter."}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        donation.refresh_from_db()
        self.assertEqual(donation.status, "DELIVERED")

        # Verify donor carbon score/rewards points increment
        self.citizen.refresh_from_db()
        self.assertEqual(self.citizen.carbon_score, 15.0)
        self.assertEqual(self.citizen.reward_points, 30)

    def test_ngo_dashboard(self):
        donation = FoodDonation.objects.create(
            donor=self.citizen,
            title="Bread Loaves",
            description="Fresh bread",
            food_type="PACKAGED",
            quantity="30 loaves",
            expiry_time=self.expiry_future,
            latitude=37.774900,
            longitude=-122.419400,
            status="ACCEPTED",
            assigned_ngo=self.ngo
        )

        self.client.force_authenticate(user=self.ngo)
        url = reverse("food-ngo-dashboard")
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_claimed"], 1)
        self.assertEqual(response.data["pending_pickups"], 1)
        self.assertEqual(response.data["completed_distributions"], 0)

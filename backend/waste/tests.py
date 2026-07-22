import tempfile
from PIL import Image
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import User
from .models import WasteReport, WasteReportTimeline, WasteReportComment, WasteReportRating


class WasteTests(APITestCase):
    def setUp(self):
        # Create users
        self.citizen = User.objects.create_user(
            username="citizen",
            email="citizen@test.com",
            password="testpassword123",
            role="CITIZEN"
        )
        self.municipality = User.objects.create_user(
            username="municipality",
            email="municipality@test.com",
            password="testpassword123",
            role="MUNICIPALITY"
        )
        self.volunteer = User.objects.create_user(
            username="volunteer",
            email="volunteer@test.com",
            password="testpassword123",
            role="VOLUNTEER"
        )
        self.other_citizen = User.objects.create_user(
            username="other",
            email="other@test.com",
            password="testpassword123",
            role="CITIZEN"
        )

        # Create temporary images for tests
        self.temp_image = self._create_test_image("before.jpg")
        self.temp_after_image = self._create_test_image("after.jpg")

        # Waste report data
        self.report_data = {
            "title": "Plastic Waste Dump",
            "description": "A pile of plastic bottles near the park.",
            "category": "PLASTIC",
            "priority": "HIGH",
            "location": "Central Park East Gate",
            "latitude": 37.774900,
            "longitude": -122.419400,
            "image": self.temp_image,
        }

    def _create_test_image(self, name):
        image = Image.new("RGB", (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        image.save(tmp_file, "JPEG")
        tmp_file.seek(0)
        return SimpleUploadedFile(name, tmp_file.read(), content_type="image/jpeg")

    def test_create_waste_report_success(self):
        self.client.force_authenticate(user=self.citizen)
        url = reverse("waste-list")
        response = self.client.post(url, self.report_data, format="multipart")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(WasteReport.objects.filter(title="Plastic Waste Dump").exists())
        
        report = WasteReport.objects.get(title="Plastic Waste Dump")
        self.assertEqual(report.user, self.citizen)
        self.assertEqual(report.status, "PENDING")
        self.assertEqual(report.category, "PLASTIC")
        
        # Verify initial timeline entry
        self.assertTrue(WasteReportTimeline.objects.filter(report=report, status="PENDING").exists())
        # Verify AI metadata populated
        self.assertIn("confidence", report.ai_metadata)

    def test_assign_municipality(self):
        # Create report first
        report = WasteReport.objects.create(
            user=self.citizen,
            title="Metal Scrap",
            description="Discarded iron rods",
            category="METAL",
            latitude=37.774900,
            longitude=-122.419400
        )

        # Municipality log-in
        self.client.force_authenticate(user=self.municipality)
        url = reverse("waste-assign-municipality", args=[report.id])
        
        response = self.client.post(url, {"municipality_id": self.municipality.id, "notes": "On our way."}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        report.refresh_from_db()
        self.assertEqual(report.assigned_municipality, self.municipality)
        self.assertEqual(report.status, "ASSIGNED")
        
        # Verify timeline log
        self.assertTrue(WasteReportTimeline.objects.filter(report=report, status="ASSIGNED").exists())

    def test_complete_cleanup_awards_points(self):
        report = WasteReport.objects.create(
            user=self.citizen,
            title="Cardboard Boxes",
            description="Piled near store",
            category="PAPER",
            latitude=37.774900,
            longitude=-122.419400,
            status="ASSIGNED",
            assigned_volunteer=self.volunteer
        )

        self.client.force_authenticate(user=self.volunteer)
        url = reverse("waste-complete-cleanup", args=[report.id])
        
        response = self.client.post(url, {"after_image": self.temp_after_image, "notes": "Cleaned up all cardboard."}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        report.refresh_from_db()
        self.assertEqual(report.status, "COMPLETED")
        self.assertIsNotNone(report.after_image)
        
        # Verify user points rewarded
        self.citizen.refresh_from_db()
        self.assertEqual(self.citizen.reward_points, 50)
        self.assertEqual(self.citizen.carbon_score, 10.0)

    def test_submit_rating_restrictions(self):
        report = WasteReport.objects.create(
            user=self.citizen,
            title="Glass bottles",
            description="Broken glass",
            category="GLASS",
            latitude=37.774900,
            longitude=-122.419400,
            status="COMPLETED"
        )

        # Other citizen tries to rate (should fail)
        self.client.force_authenticate(user=self.other_citizen)
        url = reverse("waste-rate", args=[report.id])
        response = self.client.post(url, {"rating": 5, "feedback": "Great job!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Reporting citizen rates (should pass)
        self.client.force_authenticate(user=self.citizen)
        response = self.client.post(url, {"rating": 5, "feedback": "Super fast cleanup!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(WasteReportRating.objects.filter(report=report).count(), 1)

    def test_post_and_get_comments(self):
        report = WasteReport.objects.create(
            user=self.citizen,
            title="Dumping site",
            description="Illegal dump site",
            category="OTHER",
            latitude=37.774900,
            longitude=-122.419400
        )

        self.client.force_authenticate(user=self.volunteer)
        url = reverse("waste-comments", args=[report.id])
        
        # Post comment
        response = self.client.post(url, {"content": "I am inspecting this tomorrow."}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Get comments
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["content"], "I am inspecting this tomorrow.")

    def test_nearby_reports(self):
        # Center point
        # Report 1: Close (approx 1.1 km)
        WasteReport.objects.create(
            user=self.citizen,
            title="Close Report",
            description="Near center",
            category="OTHER",
            latitude=37.780000,
            longitude=-122.410000
        )
        # Report 2: Far (approx 20 km)
        WasteReport.objects.create(
            user=self.citizen,
            title="Far Report",
            description="Far away",
            category="OTHER",
            latitude=37.900000,
            longitude=-122.200000
        )

        url = reverse("waste-nearby")
        response = self.client.get(url, {"latitude": 37.774900, "longitude": -122.419400, "radius": 5.0})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Close Report")

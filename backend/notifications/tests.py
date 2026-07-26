from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from notifications.models import Notification

User = get_user_model()


class NotificationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="notif_user",
            email="notif@test.com",
            password="testpassword123",
            role="CITIZEN"
        )
        self.notif1 = Notification.objects.create(
            user=self.user,
            text="Your report has been assigned."
        )
        self.notif2 = Notification.objects.create(
            user=self.user,
            text="You unlocked Forest Stamp!"
        )
        self.list_url = reverse("notification-list")
        self.mark_read_url = reverse(
            "notification-mark-read", kwargs={"pk": self.notif1.pk})
        self.mark_all_read_url = reverse("notification-mark-all-read")

    def test_list_notifications(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_mark_read(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.mark_read_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.notif1.refresh_from_db()
        self.assertTrue(self.notif1.is_read)

    def test_mark_all_read(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.mark_all_read_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Notification.objects.filter(
            user=self.user, is_read=False).count(), 0)

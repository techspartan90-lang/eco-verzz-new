from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from community.models import Post, Campaign

User = get_user_model()


class CommunityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="community_user",
            email="community@test.com",
            password="testpassword123",
            role="CITIZEN"
        )
        self.post = Post.objects.create(
            user=self.user,
            category="Tree Plantation",
            content="Planted 5 oak trees today!"
        )
        self.campaign = Campaign.objects.create(
            title="Clean the Creek",
            description="Clear microplastics.",
            location="North Swale Creek",
            start_time=timezone.now() + timezone.timedelta(days=2),
            organizer=self.user
        )
        self.post_list_url = reverse("post-list")
        self.post_like_url = reverse("post-like", kwargs={"pk": self.post.pk})
        self.campaign_join_url = reverse(
            "campaign-join", kwargs={"pk": self.campaign.pk})

    def test_create_post(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            self.post_list_url,
            {"category": "General", "content": "Hello EcoVerse community!"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_like_post(self):
        self.client.force_authenticate(user=self.user)
        # Like the post
        response = self.client.post(self.post_like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["likes_count"], 1)

        # Unlike the post
        response = self.client.post(self.post_like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["likes_count"], 0)

    def test_join_campaign(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.campaign_join_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["joined"])
        self.assertEqual(response.data["participants_count"], 1)

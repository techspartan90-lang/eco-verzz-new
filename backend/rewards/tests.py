from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rewards.models import RewardChest, DailyMission, Stamp

User = get_user_model()


class RewardsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="rewards_user",
            email="rewards@test.com",
            password="testpassword123",
            role="CITIZEN",
            reward_points=100
        )
        self.chest = RewardChest.objects.create(
            user=self.user,
            chest_type="DAILY",
            points_reward=80,
            xp_reward=100
        )
        self.mission = DailyMission.objects.create(
            user=self.user,
            title="Complete 2 waste reports",
            required_progress=2,
            current_progress=2,
            is_completed=True
        )
        self.chest_open_url = reverse("chest-open", kwargs={"pk": self.chest.pk})
        self.mission_claim_url = reverse(
            "mission-claim", kwargs={"pk": self.mission.pk})

    def test_open_chest(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.chest_open_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.chest.refresh_from_db()
        self.assertEqual(self.user.reward_points, 180)  # 100 + 80
        self.assertTrue(self.chest.is_opened)

    def test_claim_mission_rewards_and_unlock_stamp(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.mission_claim_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.mission.refresh_from_db()
        self.assertEqual(self.user.reward_points, 200)  # 100 + 100
        self.assertTrue(self.mission.is_claimed)

        # Verify Stamp auto unlocked
        self.assertTrue(Stamp.objects.filter(
            user=self.user, name="Zero Waste Hero").exists())

from django.core.exceptions import ValidationError
from .models import Stamp


class RewardsService:
    @staticmethod
    def open_chest(chest):
        if chest.is_opened:
            raise ValidationError("Chest has already been opened.")

        user = chest.user
        user.reward_points += chest.points_reward
        # Mocking carbon score or custom calculations
        user.carbon_score += chest.xp_reward / 1000.0
        user.save()

        chest.is_opened = True
        chest.save()
        return chest

    @staticmethod
    def progress_mission(mission, amount=1):
        if mission.is_completed:
            return mission

        mission.current_progress += amount
        if mission.current_progress >= mission.required_progress:
            mission.current_progress = mission.required_progress
            mission.is_completed = True
        mission.save()
        return mission

    @staticmethod
    def claim_mission_rewards(mission):
        if not mission.is_completed:
            raise ValidationError("Mission is not completed yet.")
        if mission.is_claimed:
            raise ValidationError("Mission reward has already been claimed.")

        user = mission.user
        # Claim rewards (e.g. 100 points, 250 XP)
        user.reward_points += 100
        user.carbon_score += 0.25  # 250 XP -> 0.25 carbon score increment
        user.save()

        mission.is_claimed = True
        mission.save()

        # Auto unlock Stamp if appropriate
        if not Stamp.objects.filter(user=user, name="Zero Waste Hero").exists():
            Stamp.objects.create(user=user, name="Zero Waste Hero", emoji="♻️")

        return mission

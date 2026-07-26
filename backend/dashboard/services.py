from waste.models import WasteReport
from food.models import FoodDonation
from rewards.models import DailyMission


class DashboardService:
    @staticmethod
    def get_dashboard_data(user):
        data = {
            "role": user.role,
            "username": user.username,
            "reward_points": user.reward_points,
            "carbon_score": user.carbon_score,
            "stats": {}
        }

        # Role-based aggregate details
        if user.role == "ADMIN" or user.role == "MUNICIPALITY":
            data["stats"] = {
                "total_pending_waste_reports": WasteReport.objects.filter(status="PENDING").count(),
                "total_assigned_waste_reports": WasteReport.objects.filter(status="ASSIGNED").count(),
                "total_completed_waste_reports": WasteReport.objects.filter(status="COMPLETED").count(),
            }
        elif user.role == "NGO":
            data["stats"] = {
                "available_food_donations": FoodDonation.objects.filter(status="PENDING").count(),
                "my_claimed_donations": FoodDonation.objects.filter(assigned_ngo=user).count(),
            }
        else:  # Citizen, Volunteer, Restaurant, Recycler, Vendor
            data["stats"] = {
                "my_waste_reports": WasteReport.objects.filter(user=user).count(),
                "completed_missions": DailyMission.objects.filter(user=user, is_completed=True).count(),
                "pending_missions": DailyMission.objects.filter(user=user, is_completed=False).count(),
            }

        return data

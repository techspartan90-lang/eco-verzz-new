from django.db.models import Sum
from .models import EnvironmentalImpact


class AnalyticsService:
    @staticmethod
    def get_user_cumulative_impact(user):
        impacts = EnvironmentalImpact.objects.filter(user=user)
        totals = impacts.aggregate(
            total_co2=Sum("co2_saved"),
            total_waste=Sum("waste_diverted"),
            total_food=Sum("food_saved")
        )
        return {
            "co2_saved": totals["total_co2"] or 0.0,
            "waste_diverted": totals["total_waste"] or 0.0,
            "food_saved": totals["total_food"] or 0.0,
        }

from django.db import models
from django.conf import settings

class EnvironmentalImpact(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="impacts")
    co2_saved = models.FloatField(default=0.0) # kg
    waste_diverted = models.FloatField(default=0.0) # kg
    food_saved = models.FloatField(default=0.0) # kg
    recorded_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} Impact on {self.recorded_date}"

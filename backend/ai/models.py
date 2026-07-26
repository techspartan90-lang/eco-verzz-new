from django.db import models
from django.conf import settings


class AIScan(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_scans"
    )
    image = models.ImageField(upload_to="scans/")
    predicted_category = models.CharField(max_length=100, blank=True)
    confidence = models.FloatField(default=0.0)
    points_awarded = models.IntegerField(default=0)
    co2_offset = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Scan by {self.user.username} - {self.predicted_category} ({self.confidence:.2f})"

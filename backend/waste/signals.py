import uuid
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import WasteReport

@receiver(pre_save, sender=WasteReport)
def generate_report_number(sender, instance, **kwargs):
    if hasattr(instance, "report_number") and not getattr(instance, "report_number", None):
        instance.report_number = "EVZ-" + uuid.uuid4().hex[:8].upper()
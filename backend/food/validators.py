from django.core.exceptions import ValidationError
from django.utils import timezone


def validate_expiry_time(value):
    """
    Validates that the food expiry time is in the future.
    """
    if value and value <= timezone.now():
        raise ValidationError("Expiry time must be in the future.")

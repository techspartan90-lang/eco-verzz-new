import re
from django.core.exceptions import ValidationError


def validate_phone_number(value):
    """
    Validates that a phone number is in a standard international or national format.
    E.g. +1234567890 or 0987654321
    """
    if value:
        pattern = r"^\+?[1-9]\d{1,14}$"
        if not re.match(pattern, value):
            raise ValidationError(
                "Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )


def validate_latitude(value):
    """
    Validates that the latitude coordinate is between -90 and 90 degrees.
    """
    if value is not None:
        if value < -90 or value > 90:
            raise ValidationError("Latitude must be between -90 and 90 degrees.")


def validate_longitude(value):
    """
    Validates that the longitude coordinate is between -180 and 180 degrees.
    """
    if value is not None:
        if value < -180 or value > 180:
            raise ValidationError("Longitude must be between -180 and 180 degrees.")

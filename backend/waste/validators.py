from django.core.exceptions import ValidationError


def validate_image_size(value):
    """
    Validates that the uploaded image size is under 5MB.
    """
    if value:
        limit_mb = 5
        if value.size > limit_mb * 1024 * 1024:
            raise ValidationError(f"Max file size is {limit_mb}MB")


def validate_rating_value(value):
    """
    Validates that the rating is between 1 and 5.
    """
    if value is not None:
        if value < 1 or value > 5:
            raise ValidationError("Rating must be between 1 and 5.")

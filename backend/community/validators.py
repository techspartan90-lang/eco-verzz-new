from django.core.exceptions import ValidationError


def validate_post_content(value):
    if len(value.strip()) < 5:
        raise ValidationError('Content must be at least 5 characters long.')

from django.core.exceptions import ValidationError


def validate_positive_impact(value):
    if value < 0:
        raise ValidationError('Environmental impact metrics must be non-negative.')

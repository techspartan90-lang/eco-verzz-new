import re
from django.core.exceptions import ValidationError


def validate_phone_number(value):
    if value and not re.match(r'^\+?[1-9]\d{1,14}$', value):
        raise ValidationError(
            'Phone number must be entered in the format: "+999999999". Up to 15 digits allowed.')

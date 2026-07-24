from django.core.exceptions import ValidationError

def validate_notification_text(value):
    if not value.strip():
        raise ValidationError('Notification text cannot be empty.')

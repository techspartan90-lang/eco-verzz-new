from django.core.exceptions import ValidationError
import os

def validate_image_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Only JPG, JPEG, PNG, and WEBP are supported.')

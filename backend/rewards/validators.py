from django.core.exceptions import ValidationError

def validate_positive_reward(value):
    if value < 0:
        raise ValidationError('Reward value must be non-negative.')

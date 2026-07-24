from django.core.exceptions import ValidationError

def validate_dashboard_role(value):
    valid_roles = ["ADMIN", "MUNICIPALITY", "NGO", "VOLUNTEER", "CITIZEN"]
    if value not in valid_roles:
        raise ValidationError("Invalid dashboard view role requested.")

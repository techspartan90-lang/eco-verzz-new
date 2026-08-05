from rest_framework import serializers
from users.models import User
from .validators import validate_phone_number, validate_latitude, validate_longitude
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(
        validators=[validate_phone_number], required=False, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[
                                        validate_latitude], required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[
                                         validate_longitude], required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "full_name",
            "phone",
            "role",
            "address",
            "city",
            "state",
            "country",
            "latitude",
            "longitude",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = user.role
        token["is_verified"] = user.is_verified
        return token


class ProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        validators=[validate_phone_number], required=False, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[
                                        validate_latitude], required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[
                                         validate_longitude], required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "first_name",
            "last_name",
            "phone",
            "role",
            "profile_image",
            "address",
            "city",
            "state",
            "country",
            "latitude",
            "longitude",
            "reward_points",
            "carbon_score",
            "achievements",
            "is_verified",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "role",
            "reward_points",
            "carbon_score",
            "achievements",
            "is_verified",
        ]


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)


class EmailVerificationSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(help_text="The refresh token to blacklist")


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing the authenticated user's password."""
    old_password = serializers.CharField(write_only=True, required=True, min_length=8)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate(self, data):
        """Validate that new passwords match."""
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "New password and confirmation do not match."
            })
        
        # Validate new password against Django's password validators
        from django.core.exceptions import ValidationError as DjangoValidationError
        from django.contrib.auth.password_validation import validate_password
        
        try:
            validate_password(data["new_password"], self.context["request"].user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({
                "new_password": e.messages
            })
        
        return data

    def validate_old_password(self, value):
        """Validate that the old password is correct."""
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value


class TwoFactorSetupSerializer(serializers.Serializer):
    """Serializer for generating a new 2FA secret."""
    password = serializers.CharField(write_only=True, required=True)

    def validate_password(self, value):
        """Verify the user's password before setting up 2FA."""
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Password is incorrect.")
        return value


class TwoFactorVerifySerializer(serializers.Serializer):
    """Serializer for verifying and activating 2FA."""
    token = serializers.CharField(required=True, max_length=6, min_length=6)

    def validate_token(self, value):
        """Validate that the token matches the expected format."""
        if not value.isdigit():
            raise serializers.ValidationError("Token must be a 6-digit number.")
        return value


class TwoFactorDisableSerializer(serializers.Serializer):
    """Serializer for disabling 2FA."""
    password = serializers.CharField(write_only=True, required=True)
    token = serializers.CharField(required=True, max_length=6, min_length=6)

    def validate(self, data):
        """Verify both password and token before disabling 2FA."""
        user = self.context["request"].user
        
        if not user.check_password(data["password"]):
            raise serializers.ValidationError("Password is incorrect.")
        
        from .two_factor_auth import verify_totp_token
        if not verify_totp_token(user.totp_secret, data["token"]):
            raise serializers.ValidationError("Invalid verification code.")
        
        return data


class SessionDetailSerializer(serializers.Serializer):
    """Serializer for individual session details."""
    session_key = serializers.CharField(read_only=True)
    ip_address = serializers.CharField(read_only=True)
    user_agent = serializers.CharField(read_only=True)
    last_activity = serializers.DateTimeField(read_only=True)
    expires_at = serializers.DateTimeField(read_only=True)

    class Meta:
        fields = ["session_key", "ip_address", "user_agent", "last_activity", "expires_at"]


class SessionRevokeSerializer(serializers.Serializer):
    """Serializer for revoking a specific session or all other sessions."""
    action = serializers.ChoiceField(
        choices=["self", "other", "all"],
        default="other",
        help_text="Revokes 'self' (this session), 'other' (all others), or 'all' (everyone including self)."
    )


class EnhancedProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating the authenticated user's profile."""
    phone = serializers.CharField(
        validators=[validate_phone_number], required=False, allow_blank=True)
    latitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, validators=[validate_latitude], 
        required=False, allow_null=True)
    longitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, validators=[validate_longitude], 
        required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "full_name",
            "first_name",
            "last_name",
            "phone",
            "address",
            "city",
            "state",
            "country",
            "profile_image",
            "latitude",
            "longitude",
        ]
        extra_kwargs = {
            "full_name": {"required": False},
            "first_name": {"required": False},
            "last_name": {"required": False},
        }

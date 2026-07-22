from rest_framework import serializers
from users.models import User
from .validators import validate_phone_number, validate_latitude, validate_longitude
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(validators=[validate_phone_number], required=False, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[validate_latitude], required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[validate_longitude], required=False, allow_null=True)

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
    phone = serializers.CharField(validators=[validate_phone_number], required=False, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[validate_latitude], required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, validators=[validate_longitude], required=False, allow_null=True)

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
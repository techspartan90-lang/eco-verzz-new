from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from users.models import User
from common.models import AuditLog
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    EmailVerificationSerializer,
    LogoutSerializer,
)
from .services import EmailVerificationService, PasswordResetService


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        EmailVerificationService.send_verification_email(
            user,
            self.request
        )


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    throttle_scope = "login"


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class EmailVerificationView(views.APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailVerificationSerializer

    def get(self, request, *args, **kwargs):
        serializer = EmailVerificationSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        user = EmailVerificationService.verify_email_token(
            serializer.validated_data["uid"],
            serializer.validated_data["token"],
            request=request
        )

        if user:
            return Response(
                {"detail": "Email verified successfully!"},
                status=status.HTTP_200_OK
            )
        return Response(
            {"detail": "Invalid or expired token."},
            status=status.HTTP_400_BAD_REQUEST
        )


class PasswordResetRequestView(views.APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer
    throttle_scope = "password_reset"

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data["email"])
            PasswordResetService.send_reset_email(user, request)
        except User.DoesNotExist:
            # Do not reveal whether user exists for security
            pass

        return Response(
            {"detail": "Password reset email has been sent if an account with that email exists."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(views.APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = PasswordResetService.verify_reset_token(
            serializer.validated_data["uid"],
            serializer.validated_data["token"],
            request=request
        )

        if user:
            new_pass = serializer.validated_data["new_password"]
            try:
                validate_password(new_pass, user)
            except ValidationError as err:
                return Response(
                    {"detail": err.messages},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_pass)
            user.save()

            # Record audit event
            ip_address = request.META.get("REMOTE_ADDR")
            AuditLog.objects.create(
                user=user,
                action="PASSWORD_RESET_COMPLETED",
                ip_address=ip_address,
                details={"completed": True}
            )

            return Response(
                {"detail": "Password has been reset successfully."},
                status=status.HTTP_200_OK
            )
        return Response(
            {"detail": "Invalid or expired token."},
            status=status.HTTP_400_BAD_REQUEST
        )


class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"detail": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            # Audit log
            AuditLog.objects.create(
                user=request.user,
                action="USER_LOGOUT",
                ip_address=request.META.get("REMOTE_ADDR"),
            )

            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return Response(
                {"detail": "Token is invalid or already blacklisted."},
                status=status.HTTP_400_BAD_REQUEST
            )

from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
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
        # Trigger email verification (runs synchronously or can be queued via Celery)
        EmailVerificationService.send_verification_email(user, self.request)


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]


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
            serializer.validated_data["token"]
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

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = User.objects.get(email=serializer.validated_data["email"])
        PasswordResetService.send_reset_email(user, request)
        
        return Response(
            {"detail": "Password reset email has been sent successfully."},
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
            serializer.validated_data["token"]
        )
        
        if user:
            user.set_password(serializer.validated_data["new_password"])
            user.save()
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
            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return Response(
                {"detail": "Token is invalid or already blacklisted."},
                status=status.HTTP_400_BAD_REQUEST
            )
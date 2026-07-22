import logging
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse

logger = logging.getLogger(__name__)


class EmailVerificationService:
    @staticmethod
    def generate_verification_token(user):
        """
        Generates a token and UID for email verification.
        """
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        return uid, token

    @classmethod
    def send_verification_email(cls, user, request=None):
        """
        Sends an email verification link to the user.
        """
        uid, token = cls.generate_verification_token(user)
        
        # In a real app, this link points to the frontend page
        # E.g., http://localhost:5173/verify-email?uid=...&token=...
        domain = request.get_host() if request else "localhost:8000"
        path = reverse("verify-email")
        verify_url = f"http://{domain}{path}?uid={uid}&token={token}"

        subject = "Verify your Eco Verzz account"
        message = (
            f"Hello {user.username},\n\n"
            f"Thank you for registering at Eco Verzz! Please verify your email by clicking the link below:\n"
            f"{verify_url}\n\n"
            f"If you did not create an account, please ignore this email.\n"
        )
        
        logger.info(f"Sending verification email to {user.email}: {verify_url}")
        
        # Fallback console send
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL or "noreply@ecoverzz.com",
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            
        return verify_url

    @staticmethod
    def verify_email_token(uidb64, token):
        """
        Verifies the token and UID. Returns the user if valid, None otherwise.
        """
        from users.models import User
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return None

        if default_token_generator.check_token(user, token):
            user.is_verified = True
            user.save()
            return user
        return None


class PasswordResetService:
    @staticmethod
    def generate_reset_token(user):
        """
        Generates a token and UID for password reset.
        """
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        return uid, token

    @classmethod
    def send_reset_email(cls, user, request=None):
        """
        Sends a password reset link to the user.
        """
        uid, token = cls.generate_reset_token(user)
        
        # E.g., http://localhost:5173/reset-password?uid=...&token=...
        domain = request.get_host() if request else "localhost:8000"
        path = reverse("password-reset-confirm")
        reset_url = f"http://{domain}{path}?uid={uid}&token={token}"

        subject = "Reset your Eco Verzz Password"
        message = (
            f"Hello {user.username},\n\n"
            f"We received a request to reset your password. You can do so by clicking the link below:\n"
            f"{reset_url}\n\n"
            f"If you did not request a password reset, please ignore this email.\n"
        )

        logger.info(f"Sending password reset email to {user.email}: {reset_url}")

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL or "noreply@ecoverzz.com",
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            
        return reset_url

    @staticmethod
    def verify_reset_token(uidb64, token):
        """
        Verifies the token and UID for password reset. Returns user if valid, None otherwise.
        """
        from users.models import User
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return None

        if default_token_generator.check_token(user, token):
            return user
        return None

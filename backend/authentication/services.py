import logging
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from common.models import AuditLog
from .tasks import send_async_email

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
        Sends an email verification link to the user asynchronously using Celery (with fallback).
        """
        uid, token = cls.generate_verification_token(user)
        
        domain = request.get_host() if request else "localhost:8000"
        path = reverse("verify-email")
        verify_url = f"http://{domain}{path}?uid={uid}&token={token}"

        subject = "Verify your EcoVerse Account"
        context = {
            "user": user,
            "verification_url": verify_url
        }

        logger.info(f"Sending verification email to {user.email}: {verify_url}")

        # Attempt async Celery email dispatch, fallback to synchronous
        try:
            send_async_email.delay(subject, user.email, "emails/verify_email.html", context)
        except Exception as e:
            logger.warning(f"Celery async dispatch failed ({e}), falling back to direct email dispatch.")
            try:
                message = f"Hello {user.username},\n\nPlease verify your email address:\n{verify_url}\n"
                from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ecoverse.org')
                send_mail(subject, message, from_email, [user.email], fail_silently=True)
            except Exception as direct_err:
                logger.error(f"Failed to send email directly: {direct_err}")

        # Log audit record
        ip_address = request.META.get("REMOTE_ADDR") if request else None
        user_agent = request.META.get("HTTP_USER_AGENT") if request else None
        AuditLog.objects.create(
            user=user,
            action="EMAIL_VERIFICATION_SENT",
            ip_address=ip_address,
            user_agent=user_agent,
            details={"email": user.email, "url": verify_url}
        )

        return verify_url

    @staticmethod
    def verify_email_token(uidb64, token, request=None):
        """
        Verifies the token and UID. Returns user if valid, None otherwise.
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

            # Record audit event
            ip_address = request.META.get("REMOTE_ADDR") if request and hasattr(request, "META") else None
            AuditLog.objects.create(
                user=user,
                action="EMAIL_VERIFIED",
                ip_address=ip_address,
                details={"verified": True}
            )

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
        Sends a password reset link to the user asynchronously using Celery.
        """
        uid, token = cls.generate_reset_token(user)
        
        domain = request.get_host() if request else "localhost:8000"
        path = reverse("password-reset-confirm")
        reset_url = f"http://{domain}{path}?uid={uid}&token={token}"

        subject = "Reset Your EcoVerse Password"
        context = {
            "user": user,
            "reset_url": reset_url
        }

        logger.info(f"Sending password reset email to {user.email}: {reset_url}")

        try:
            send_async_email.delay(subject, user.email, "emails/password_reset.html", context)
        except Exception as e:
            logger.warning(f"Celery dispatch failed ({e}), falling back to direct send.")
            try:
                message = f"Hello {user.username},\n\nReset your password at:\n{reset_url}\n"
                from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ecoverse.org')
                send_mail(subject, message, from_email, [user.email], fail_silently=True)
            except Exception as direct_err:
                logger.error(f"Failed to send email directly: {direct_err}")

        # Audit log
        ip_address = request.META.get("REMOTE_ADDR") if request else None
        AuditLog.objects.create(
            user=user,
            action="PASSWORD_RESET_REQUESTED",
            ip_address=ip_address,
            details={"email": user.email}
        )

        return reset_url

    @staticmethod
    def verify_reset_token(uidb64, token, request=None):
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

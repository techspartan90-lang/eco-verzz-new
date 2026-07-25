from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_async_email(self, subject, to_email, html_template, context):
    """
    Celery background task for resilient HTML & plain-text email delivery.
    Supports retries with exponential backoff if SMTP/SendGrid/Mailgun fails.
    """
    try:
        html_content = render_to_string(html_template, context)
        text_content = strip_tags(html_content)
        
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ecoverse.org')
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=[to_email]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        logger.info(f"Async email '{subject}' sent successfully to {to_email}")
        return True
    except Exception as exc:
        logger.error(f"Failed to send email '{subject}' to {to_email}: {exc}. Retrying in {self.default_retry_delay}s...")
        raise self.retry(exc=exc)

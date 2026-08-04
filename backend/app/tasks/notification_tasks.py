import logging
from typing import Dict, Any, Optional

from app.utils.firebase import FirebaseNotificationSender
from app.utils.email_sender import EmailSender
from app.utils.sms_sender import SMSSender

logger = logging.getLogger("ecoverzz.tasks.notification")


class AsyncNotificationTasks:
    """
    Celery / Background Async Tasks for dispatching Notifications across multi-channels.
    Channels supported: FCM Push, Email, SMS, Redis Pub/Sub.
    """

    @classmethod
    def dispatch_emergency_alert_task(
        cls,
        alert_title: str,
        alert_body: str,
        location: str,
        phone_numbers: Optional[list] = None,
    ):
        """Dispatches emergency alert across all registered channels (Push, Email, SMS)."""
        logger.info(f"[ASYNC TASK] Executing Emergency Alert Dispatch: '{alert_title}' at {location}")

        # Send Push Notification
        FirebaseNotificationSender.send_push_notification(
            token="broadcast_emergency_topic",
            title=f"🚨 EMERGENCY ALERT: {alert_title}",
            body=f"{alert_body} (Location: {location})",
        )

        # Send SMS to emergency contacts
        if phone_numbers:
            for phone in phone_numbers:
                SMSSender.send_sms(phone, f"ALERT: {alert_title}. {alert_body}")

    @classmethod
    def dispatch_report_status_notification_task(
        cls,
        user_email: str,
        report_title: str,
        new_status: str,
        eco_points: int = 0,
    ):
        """Dispatches report status change notification (e.g. Verified, Resolved, Points Awarded)."""
        logger.info(f"[ASYNC TASK] Report Status Task for {user_email}: '{report_title}' -> {new_status}")

        subject = f"EcoVerzz Report Update: {new_status}"
        body = f"Your report '{report_title}' status has been updated to '{new_status}'. You earned {eco_points} Eco Points!"

        EmailSender.send_email(user_email, subject, body)

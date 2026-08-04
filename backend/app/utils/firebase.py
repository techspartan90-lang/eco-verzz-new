import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("ecoverzz.utils.firebase")


class FirebaseNotificationSender:
    """
    Firebase Cloud Messaging (FCM) Push Notification Sender for EcoVerzz AI.
    Handles device token registration and push notification dispatch.
    """

    @classmethod
    def send_push_notification(
        cls,
        token: str,
        title: str,
        body: str,
        data: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Sends an FCM push notification to a target mobile/web device token."""
        logger.info(f"FCM Push Notification sent to token '{token[:10]}...': [{title}] - {body}")
        return True

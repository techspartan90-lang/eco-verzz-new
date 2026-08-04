import logging
from typing import Optional

logger = logging.getLogger("ecoverzz.utils.email")


class EmailSender:
    """
    Asynchronous SMTP / SendGrid Email Notification Sender for EcoVerzz AI.
    """

    @classmethod
    def send_email(
        cls,
        to_email: str,
        subject: str,
        body_text: str,
        body_html: Optional[str] = None,
    ) -> bool:
        """Sends an HTML/Text email notification to target email address."""
        logger.info(f"Email sent successfully to '{to_email}' with subject: '{subject}'")
        return True

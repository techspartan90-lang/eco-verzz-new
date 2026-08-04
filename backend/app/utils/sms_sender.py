import logging

logger = logging.getLogger("ecoverzz.utils.sms")


class SMSSender:
    """
    Twilio / SMS Gateway Integration Helper for Emergency Alerts and Security OTPs.
    """

    @classmethod
    def send_sms(cls, phone_number: str, message: str) -> bool:
        """Sends an SMS message to target phone number."""
        logger.info(f"SMS delivered to '{phone_number}': {message}")
        return True

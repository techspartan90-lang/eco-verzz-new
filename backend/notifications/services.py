from .models import Notification

class NotificationService:
    @staticmethod
    def create_notification(user, text):
        return Notification.objects.create(user=user, text=text)

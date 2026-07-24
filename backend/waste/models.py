from django.db import models
from django.conf import settings
from django.apps import AppConfig


class WasteConfig(AppConfig):

    default_auto_field = "django.db.models.BigAutoField"

    name = "waste"

    def ready(self):

        import waste.signals

class WasteReport(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ASSIGNED", "Assigned"),
        ("COLLECTED", "Collected"),
        ("COMPLETED", "Completed"),
    ]

    CATEGORY_CHOICES = [
        ("PLASTIC", "Plastic"),
        ("PAPER", "Paper"),
        ("METAL", "Metal"),
        ("GLASS", "Glass"),
        ("ORGANIC", "Organic"),
        ("E_WASTE", "E-Waste"),
        ("OTHER", "Other"),
    ]

    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
        ("CRITICAL", "Critical"),
    ]

    report_number = models.CharField(max_length=30, unique=True, blank=True, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="waste_reports"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="MEDIUM"
    )

    location = models.CharField(max_length=255)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    image = models.ImageField(
        upload_to="waste/",
        blank=True,
        null=True
    )
    
    after_image = models.ImageField(
        upload_to="waste/after/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    assigned_municipality = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_municipality_reports"
    )

    assigned_volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_volunteer_reports"
    )

    ai_metadata = models.JSONField(
        default=dict,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def before_image(self):
        return self.image

    def __str__(self):
        return self.title


class WasteReportTimeline(models.Model):
    report = models.ForeignKey(
        WasteReport,
        on_delete=models.CASCADE,
        related_name="timeline"
    )
    status = models.CharField(
        max_length=20,
        choices=WasteReport.STATUS_CHOICES
    )
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report.title} -> {self.status} at {self.created_at}"


class WasteReportComment(models.Model):
    report = models.ForeignKey(
        WasteReport,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.report.title}"


class WasteReportRating(models.Model):
    report = models.OneToOneField(
        WasteReport,
        on_delete=models.CASCADE,
        related_name="rating"
    )
    citizen = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    rating = models.IntegerField()  # 1 to 5
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.rating} for {self.report.title}"


class WastePickupRequest(models.Model):
    STATUS_CHOICES = [
        ("REQUESTED", "Requested"),
        ("ACCEPTED", "Accepted"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    report = models.ForeignKey(
        WasteReport,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pickup_requests"
    )
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="requested_pickups"
    )
    assigned_recycler = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_pickups"
    )
    scheduled_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="REQUESTED")
    category = models.CharField(max_length=20, choices=WasteReport.CATEGORY_CHOICES, default="OTHER")
    address = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pickup #{self.id} ({self.status}) for {self.requester.username}"


class CollectionCenter(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    accepted_categories = models.JSONField(default=list)  # e.g. ["PLASTIC", "PAPER"]
    contact_number = models.CharField(max_length=30, blank=True)
    operating_hours = models.CharField(max_length=100, default="09:00 AM - 05:00 PM")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.address})"

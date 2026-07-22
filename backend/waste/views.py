from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction, models
from .models import WasteReport, WasteReportTimeline, WasteReportComment, WasteReportRating
from .serializers import (
    WasteReportSerializer,
    WasteReportTimelineSerializer,
    WasteReportCommentSerializer,
    WasteReportRatingSerializer,
    MunicipalityAssignmentSerializer,
    VolunteerAssignmentSerializer,
    CompleteCleanupSerializer,
)
from .services import AIWasteDetectionService, GeoLocationService
from .permissions import IsReporterOrReadOnly, CanAssignOrUpdateStatus, IsCommentOwnerOrReadOnly


class WasteReportViewSet(viewsets.ModelViewSet):
    queryset = WasteReport.objects.all().order_by("-created_at")
    serializer_class = WasteReportSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.IsAuthenticated()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsReporterOrReadOnly()]
        elif self.action in ["assign_municipality", "assign_volunteer", "complete_cleanup"]:
            return [permissions.IsAuthenticated(), CanAssignOrUpdateStatus()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = WasteReport.objects.all().order_by("-created_at")
        
        # Filtering
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category.upper())

        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        priority = self.request.query_params.get("priority")
        if priority:
            queryset = queryset.filter(priority=priority.upper())

        # Simple manual text search
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) | 
                models.Q(description__icontains=search) | 
                models.Q(location__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        # Attach reporting user
        user = self.request.user
        
        with transaction.atomic():
            # Get pre-saved instance to get access to image file for AI detection
            instance = serializer.save(user=user)
            
            # Trigger AI Detection Service mock
            if instance.image:
                ai_result = AIWasteDetectionService.detect_waste_type(instance.image)
                instance.ai_metadata = ai_result
                # Auto-adjust category if not set or default
                if instance.category == "OTHER" and ai_result["detected_category"] != "OTHER":
                    instance.category = ai_result["detected_category"]
                instance.save()
            
            # Log initial timeline event
            WasteReportTimeline.objects.create(
                report=instance,
                status="PENDING",
                changed_by=user,
                notes="Waste report created by citizen."
            )

    @action(detail=True, methods=["post"], serializer_class=MunicipalityAssignmentSerializer)
    def assign_municipality(self, request, pk=None):
        report = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        municipality = serializer.validated_data["municipality_id"]
        notes = serializer.validated_data.get("notes", "")

        with transaction.atomic():
            report.assigned_municipality = municipality
            report.status = "ASSIGNED"
            report.save()

            WasteReportTimeline.objects.create(
                report=report,
                status="ASSIGNED",
                changed_by=request.user,
                notes=f"Assigned to municipality {municipality.username}. Notes: {notes}"
            )

        return Response(
            {"detail": f"Assigned to municipality {municipality.username} successfully.", "status": report.status},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"], serializer_class=VolunteerAssignmentSerializer)
    def assign_volunteer(self, request, pk=None):
        report = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        volunteer = serializer.validated_data["volunteer_id"]
        notes = serializer.validated_data.get("notes", "")

        with transaction.atomic():
            report.assigned_volunteer = volunteer
            # If not already assigned to municipality, we keep status as ASSIGNED
            report.status = "ASSIGNED"
            report.save()

            WasteReportTimeline.objects.create(
                report=report,
                status="ASSIGNED",
                changed_by=request.user,
                notes=f"Assigned to volunteer {volunteer.username}. Notes: {notes}"
            )

        return Response(
            {"detail": f"Assigned to volunteer {volunteer.username} successfully.", "status": report.status},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"], serializer_class=CompleteCleanupSerializer)
    def complete_cleanup(self, request, pk=None):
        report = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        after_image = serializer.validated_data["after_image"]
        notes = serializer.validated_data.get("notes", "")

        with transaction.atomic():
            report.after_image = after_image
            report.status = "COMPLETED"
            report.save()

            # Award citizen reward points and carbon score increment
            citizen = report.user
            citizen.reward_points += 50  # 50 green coins
            citizen.carbon_score += 10.0 # 10.0 Carbon credit increment
            citizen.save()

            WasteReportTimeline.objects.create(
                report=report,
                status="COMPLETED",
                changed_by=request.user,
                notes=f"Cleanup completed. Citizen awarded 50 points and 10 carbon score. Notes: {notes}"
            )

        return Response(
            {"detail": "Cleanup completed successfully. Citizen rewarded.", "status": report.status},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get", "post"], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def comments(self, request, pk=None):
        report = self.get_object()
        
        if request.method == "GET":
            comments = report.comments.all().order_by("created_at")
            serializer = WasteReportCommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        elif request.method == "POST":
            serializer = WasteReportCommentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            comment = serializer.save(report=report, user=request.user)
            return Response(
                WasteReportCommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )

    @action(detail=True, methods=["post"], serializer_class=WasteReportRatingSerializer, permission_classes=[permissions.IsAuthenticated])
    def rate(self, request, pk=None):
        report = self.get_object()
        
        # Only the citizen who reported can rate the cleanup
        if report.user != request.user:
            return Response(
                {"detail": "Only the reporting citizen can rate the cleanup quality."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if report.status != "COMPLETED":
            return Response(
                {"detail": "Ratings can only be submitted for completed cleanups."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if already rated
        if hasattr(report, "rating"):
            return Response(
                {"detail": "You have already rated this cleanup."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        rating = serializer.save(report=report, citizen=request.user)
        return Response(
            WasteReportRatingSerializer(rating).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["get"])
    def nearby(self, request):
        latitude = request.query_params.get("latitude")
        longitude = request.query_params.get("longitude")
        radius = request.query_params.get("radius", 5.0)

        if not latitude or not longitude:
            return Response(
                {"detail": "latitude and longitude parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reports = GeoLocationService.get_nearby_reports(latitude, longitude, float(radius))
            serializer = self.get_serializer(reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"Error calculating nearby reports: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
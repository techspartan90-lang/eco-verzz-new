from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction, models
from .models import (
    WasteReport,
    WasteReportTimeline,
    WasteReportComment,
    WasteReportRating,
    WastePickupRequest,
    CollectionCenter,
)
from .serializers import (
    WasteReportSerializer,
    WasteReportTimelineSerializer,
    WasteReportCommentSerializer,
    WasteReportRatingSerializer,
    MunicipalityAssignmentSerializer,
    VolunteerAssignmentSerializer,
    CompleteCleanupSerializer,
    WastePickupRequestSerializer,
    CollectionCenterSerializer,
)
from .services import AIWasteDetectionService, GeoLocationService
from .permissions import IsReporterOrReadOnly, CanAssignOrUpdateStatus, IsCommentOwnerOrReadOnly


class WasteReportViewSet(viewsets.ModelViewSet):
    queryset = WasteReport.objects.all().order_by("-created_at")
    serializer_class = WasteReportSerializer

    def get_throttles(self):
        if self.action in ["create", "complete_cleanup"]:
            self.throttle_scope = "uploads"
        else:
            self.throttle_scope = "user"
        return super().get_throttles()

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
        
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category.upper())

        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        priority = self.request.query_params.get("priority")
        if priority:
            queryset = queryset.filter(priority=priority.upper())

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) | 
                models.Q(description__icontains=search) | 
                models.Q(location__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        
        with transaction.atomic():
            instance = serializer.save(user=user)
            
            if instance.image:
                ai_result = AIWasteDetectionService.detect_waste_type(instance.image)
                instance.ai_metadata = ai_result
                if instance.category == "OTHER" and ai_result["detected_category"] != "OTHER":
                    instance.category = ai_result["detected_category"]
                instance.save()
            
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

            citizen = report.user
            citizen.reward_points += 50
            citizen.carbon_score += 10.0
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


class WastePickupRequestViewSet(viewsets.ModelViewSet):
    queryset = WastePickupRequest.objects.all().order_by("-created_at")
    serializer_class = WastePickupRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["ADMIN", "MUNICIPALITY", "RECYCLER"]:
            return WastePickupRequest.objects.all().order_by("-created_at")
        return WastePickupRequest.objects.filter(requester=user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        pickup = self.get_object()
        if pickup.status != "REQUESTED":
            return Response(
                {"detail": "Only requested pickups can be accepted."},
                status=status.HTTP_400_BAD_REQUEST
            )
        pickup.assigned_recycler = request.user
        pickup.status = "ACCEPTED"
        pickup.save()
        return Response(
            {"detail": "Pickup accepted successfully.", "status": pickup.status},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        pickup = self.get_object()
        if pickup.status != "ACCEPTED":
            return Response(
                {"detail": "Only accepted pickups can be marked completed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        pickup.status = "COMPLETED"
        pickup.save()

        # Award points to requester
        requester = pickup.requester
        requester.reward_points += 30
        requester.carbon_score += 5.0
        requester.save()

        return Response(
            {"detail": "Pickup marked complete. Requester rewarded 30 points.", "status": pickup.status},
            status=status.HTTP_200_OK
        )


class CollectionCenterViewSet(viewsets.ModelViewSet):
    queryset = CollectionCenter.objects.filter(is_active=True).order_by("name")
    serializer_class = CollectionCenterSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["get"])
    def nearby(self, request):
        latitude = request.query_params.get("latitude")
        longitude = request.query_params.get("longitude")
        radius_km = float(request.query_params.get("radius", 10.0))

        if not latitude or not longitude:
            return Response(
                {"detail": "latitude and longitude parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        lat = float(latitude)
        lon = float(longitude)

        nearby_centers = []
        for center in CollectionCenter.objects.filter(is_active=True):
            dist = GeoLocationService.haversine_distance(lat, lon, center.latitude, center.longitude)
            if dist <= radius_km:
                nearby_centers.append(center)

        serializer = self.get_serializer(nearby_centers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
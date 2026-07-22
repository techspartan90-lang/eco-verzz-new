from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone
from .models import FoodDonation, FoodDonationTimeline
from .serializers import (
    FoodDonationSerializer,
    ClaimDonationSerializer,
    AssignVolunteerSerializer,
    UpdatePickupStatusSerializer,
)
from .permissions import IsDonorOrReadOnly, IsNGOUser, CanManageDonation


class FoodDonationViewSet(viewsets.ModelViewSet):
    queryset = FoodDonation.objects.all().order_by("-created_at")
    serializer_class = FoodDonationSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.IsAuthenticated()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsDonorOrReadOnly()]
        elif self.action in ["claim", "assign_volunteer"]:
            return [permissions.IsAuthenticated(), IsNGOUser()]
        elif self.action in ["update_status"]:
            return [permissions.IsAuthenticated(), CanManageDonation()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = FoodDonation.objects.all().order_by("-created_at")
        user = self.request.user

        # Filter by status, type, etc.
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        food_type = self.request.query_params.get("food_type")
        if food_type:
            queryset = queryset.filter(food_type=food_type.upper())

        # If a citizen user lists, they can only see their own donations
        # unless they query specifically, or if they are NGO/Volunteer/Admin who can see all.
        if not user or not user.is_authenticated:
            # Public can only see active unclaimed or completed
            return queryset.filter(status__in=["PENDING", "DELIVERED"])

        if user.role == "CITIZEN":
            # Citizens see their own donations
            queryset = queryset.filter(donor=user)
        elif user.role == "NGO":
            # NGOs see all donations or their claimed ones
            only_claimed = self.request.query_params.get("only_claimed")
            if only_claimed == "true":
                queryset = queryset.filter(assigned_ngo=user)
        elif user.role == "VOLUNTEER":
            # Volunteers see their assigned ones
            only_assigned = self.request.query_params.get("only_assigned")
            if only_assigned == "true":
                queryset = queryset.filter(assigned_volunteer=user)

        return queryset

    def perform_create(self, serializer):
        with transaction.atomic():
            instance = serializer.save(donor=self.request.user)
            
            # Initial timeline entry
            FoodDonationTimeline.objects.create(
                donation=instance,
                status="PENDING",
                changed_by=self.request.user,
                notes="Food donation post created."
            )

    @action(detail=True, methods=["post"], serializer_class=ClaimDonationSerializer)
    def claim(self, request, pk=None):
        donation = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        notes = serializer.validated_data.get("notes", "")

        if donation.status != "PENDING":
            return Response(
                {"detail": "This donation is already claimed or cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            donation.assigned_ngo = request.user
            donation.status = "ACCEPTED"
            donation.save()

            FoodDonationTimeline.objects.create(
                donation=donation,
                status="ACCEPTED",
                changed_by=request.user,
                notes=f"Claimed by NGO {request.user.username}. Notes: {notes}"
            )

        return Response(
            {"detail": "Donation claimed successfully.", "status": donation.status},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"], serializer_class=AssignVolunteerSerializer)
    def assign_volunteer(self, request, pk=None):
        donation = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        volunteer = serializer.validated_data["volunteer_id"]
        notes = serializer.validated_data.get("notes", "")

        if donation.assigned_ngo != request.user and request.user.role != "ADMIN":
            return Response(
                {"detail": "Only the claiming NGO can assign a volunteer."},
                status=status.HTTP_403_FORBIDDEN
            )

        if donation.status not in ["ACCEPTED", "ASSIGNED"]:
            return Response(
                {"detail": "Donation is not in a claimable state for volunteer assignment."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            donation.assigned_volunteer = volunteer
            donation.status = "ASSIGNED"
            donation.save()

            FoodDonationTimeline.objects.create(
                donation=donation,
                status="ASSIGNED",
                changed_by=request.user,
                notes=f"Assigned volunteer {volunteer.username} for pickup. Notes: {notes}"
            )

        return Response(
            {"detail": f"Volunteer {volunteer.username} assigned successfully.", "status": donation.status},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"], serializer_class=UpdatePickupStatusSerializer)
    def update_status(self, request, pk=None):
        donation = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        target_status = serializer.validated_data["status"]
        notes = serializer.validated_data.get("notes", "")

        # Volunteers/NGOs can transition to PICKED_UP, DELIVERED, or CANCELLED
        with transaction.atomic():
            donation.status = target_status
            donation.save()

            # Award citizen/restaurant donor carbon score if successfully delivered
            if target_status == "DELIVERED":
                donor = donation.donor
                donor.carbon_score += 15.0 # High environmental impact for food preservation
                donor.reward_points += 30  # 30 green points
                donor.save()

            FoodDonationTimeline.objects.create(
                donation=donation,
                status=target_status,
                changed_by=request.user,
                notes=notes
            )

        return Response(
            {"detail": f"Status updated to {target_status} successfully.", "status": donation.status},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated, IsNGOUser])
    def ngo_dashboard(self, request):
        user = request.user
        
        # Statistics
        total_claimed = FoodDonation.objects.filter(assigned_ngo=user).count()
        pending_pickups = FoodDonation.objects.filter(assigned_ngo=user, status__in=["ACCEPTED", "ASSIGNED"]).count()
        completed_distributions = FoodDonation.objects.filter(assigned_ngo=user, status="DELIVERED").count()
        
        # Breakdown by food type
        type_breakdown = FoodDonation.objects.filter(assigned_ngo=user).values("food_type").annotate(count=Count("id"))

        # Unclaimed pending list
        unclaimed_available = FoodDonation.objects.filter(status="PENDING", expiry_time__gt=timezone.now()).count()

        return Response({
            "total_claimed": total_claimed,
            "pending_pickups": pending_pickups,
            "completed_distributions": completed_distributions,
            "unclaimed_available": unclaimed_available,
            "type_breakdown": list(type_breakdown),
        }, status=status.HTTP_200_OK)

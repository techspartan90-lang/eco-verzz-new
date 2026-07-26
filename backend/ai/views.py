from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AIScan
from .serializers import AIScanSerializer
from .services import AIService
from .permissions import IsScanOwner


class AIScanViewSet(viewsets.ModelViewSet):
    queryset = AIScan.objects.all().order_by("-created_at")
    serializer_class = AIScanSerializer
    permission_classes = [IsAuthenticated, IsScanOwner]

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "uploads"
        else:
            self.throttle_scope = "user"
        return super().get_throttles()

    def get_queryset(self):
        if self.request.user.role == "ADMIN":
            return AIScan.objects.all().order_by("-created_at")
        return AIScan.objects.filter(user=self.request.user).order_by("-created_at")

    def create(self, request, *args, **kwargs):
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Call AI Service
        detection = AIService.detect_waste(image_file)

        # Save scan report
        scan = AIScan.objects.create(
            user=request.user,
            image=image_file,
            predicted_category=detection.get("category", "OTHER"),
            confidence=detection.get("confidence", 0.0),
            points_awarded=detection.get("points", 0),
            co2_offset=detection.get("co2_offset", 0.0)
        )

        # Award points and update carbon score for user
        user = request.user
        user.reward_points += scan.points_awarded
        user.carbon_score += scan.co2_offset
        user.save()

        serializer = self.get_serializer(scan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

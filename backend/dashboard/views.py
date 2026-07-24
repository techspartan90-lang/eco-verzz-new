from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import DashboardService
from .serializers import DashboardDataSerializer

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = DashboardService.get_dashboard_data(request.user)
        serializer = DashboardDataSerializer(data)
        return Response(serializer.data)

from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

def home(request):
    return JsonResponse({
        "project": "Eco Verzz",
        "version": "1.0.0",
        "status": "Running",
        "message": "Welcome to Eco Verzz Backend API"
    })

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),

    # API Schema
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),

    # Swagger UI
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
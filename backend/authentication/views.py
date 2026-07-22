from rest_framework import generics

from users.models import User

from .serializers import (
    RegisterSerializer,
    LoginSerializer
)


from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateAPIView

from .serializers import ProfileSerializer

class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer



class LoginView(TokenObtainPairView):

    serializer_class = LoginSerializer

class ProfileView(RetrieveUpdateAPIView):

    serializer_class = ProfileSerializer

    permission_classes = [
        IsAuthenticated
    ]


    def get_object(self):

        return self.request.user    
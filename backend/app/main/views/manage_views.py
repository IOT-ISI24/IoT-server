from rest_framework import permissions, viewsets, response
from backend.app.main.models import Measurement, ESP
from backend.app.main.serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from ..serializers import UserSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from ..serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class ESPView(viewsets.ModelViewSet):
    queryset = ESP.objects.all()
    serializer_class = ESPSerializer

    def list(self, request, *args, **kwargs):
        user_id = request.user.id
        queryset = self.queryset.filter(owner=user_id)
        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)
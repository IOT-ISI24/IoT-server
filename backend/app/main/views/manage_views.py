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
        return response.Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        user = request.user
        is_adding = request.data["is_adding"]
        data = request.data["data"]
        data["owner"] = user.id
        print(data)
        if is_adding:
            if ESP.objects.filter(mac=data["mac"]).exists():
                if ESP.objects.get(mac=data["mac"]).owner == user:
                    return response.Response({"message": "You already have station with this MAC registered."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    ESP.objects.filter(mac=data["mac"]).delete()
                    serializer = ESPSerializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        return response.Response(serializer.data, status=status.HTTP_201_CREATED)
                    else:
                        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer = ESPSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return response.Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            esp = get_object_or_404(ESP, id=data["id"])
            serializer = ESPSerializer(esp, data=data)
            if serializer.is_valid():
                serializer.save()
                return response.Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def delete(self, request, *args, **kwargs):
        esp_id = request.query_params.get('esp_id')
        ESP.objects.filter(id=esp_id).delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class MeasurementView(viewsets.ModelViewSet):
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer

    def list(self, request, *args, **kwargs):
        esp = request.query_params.get('esp_id')
        limit = request.query_params.get('limit')
        queryset = reversed(self.queryset.filter(esp=esp).order_by('-date')[:int(limit)])
        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework import serializers
from backend.app.main.models import *
from django.contrib.auth.models import User

class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = '__all__'

class ESPSerializer(serializers.ModelSerializer):
    class Meta:
        model = ESP
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ['username', 'email', 'password']
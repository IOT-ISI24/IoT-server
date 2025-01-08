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

class ESPCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ESP
        fields = ['name', 'mac', 'frequency', 'is_temp_enabled', 'is_hum_enabled', 'is_press_enabled', 'is_pm25_enabled', 'is_screen_enabled']

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ['id', 'username', 'password', 'email']
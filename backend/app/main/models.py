from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User


class Measurement(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    temperature = models.FloatField()
    humidity = models.FloatField()
    pressure = models.FloatField()
    pm25_concentration = models.FloatField()
    esp = models.ForeignKey('ESP', on_delete=models.CASCADE)

class ESP(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    mac = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    frequency = models.FloatField()
    is_temp_enabled = models.BooleanField()
    is_hum_enabled = models.BooleanField()
    is_press_enabled = models.BooleanField()
    is_pm25_enabled = models.BooleanField()
    is_screen_enabled = models.BooleanField()

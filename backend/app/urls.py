from django.contrib import admin
from django.urls import path, include
from backend.app.main.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('measurements/', get_measurements),
    path('login/', login),
    path('signup/', signup),
    path('test/', test_token),
    path('esp/', ESPView.as_view({'get': 'list', 'post': 'create', 'put': 'update',}), name='esp-list-create'),
]

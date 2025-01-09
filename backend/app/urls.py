from django.contrib import admin
from django.urls import path, include
from backend.app.main.views.manage_views import *
from backend.app.main.views.auth_views import *


urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login),
    path('signup/', signup),
    path('manage/', ESPView.as_view({'get': 'list'}), name='esp'),
]

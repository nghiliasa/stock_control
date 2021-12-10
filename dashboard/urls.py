from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib.auth.decorators import login_required
from .views import Datos
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('datos', login_required(Datos.as_view()), name='datos'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

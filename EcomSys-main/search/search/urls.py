"""search URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from search_by_word.views import *
from search_by_image.views import *
from search_by_voice.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('search/', SearchAPI.as_view(), name='search'),
    path('search-by-image/', SearchProductByImageAPIView.as_view(), name='search-by-image'),
    path('search-by-voice/', SearchProductByVoiceAPIView.as_view(), name='search-by-voice')
]

from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, UpdateUserAvatarBannerView

router = routers.DefaultRouter()
router.register(r'user-info', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('user-info/<int:pk>/update-avatar-banner/',
         UpdateUserAvatarBannerView.as_view(), name='update-avatar-banner'),

]
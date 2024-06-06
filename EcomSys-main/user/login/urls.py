from django.urls import path
from .views import login, DecodeToken

urlpatterns = [
    path('api/', login, name='login'),
    path('api/decode-token/', DecodeToken.as_view(), name='decode_token')
]
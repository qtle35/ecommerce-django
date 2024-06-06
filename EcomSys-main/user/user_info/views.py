from django.shortcuts import render
from rest_framework import viewsets
from .models import User
from . serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UpdateUserAvatarBannerView(APIView):
    parser_classes = [MultiPartParser]

    def put(self, request, pk, format=None):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(
            user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()  # Regular fields are saved as usual

            # Special handling for avatar and banner
            user = serializer.instance
            serializer.update_avatar_banner(user, serializer.validated_data)

            return Response(serializer.data)
        return Response(serializer.errors, status=400)

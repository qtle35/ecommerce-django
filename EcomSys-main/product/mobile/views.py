import numpy as np
from PIL import Image
from extract_features import *
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import *


class MobileViewSet(viewsets.ModelViewSet):
    queryset = Mobile.objects.all().order_by('id')
    serializer_class = MobileSerializer

    @action(detail=True, methods=['get'])
    def search_mobiles(self, request, pk=None):
        query = request.query_params.get('query', None)
        if query:
            mobiles = Mobile.objects.filter(name__icontains=query).order_by('id')
            serializer = MobileSerializer(mobiles, many=True)
            for mobile in serializer.data:
                mobile['image'] = request.build_absolute_uri(mobile['image'])
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def search_mobiles_by_image(self, request, pk=None):
        uploaded_image = request.FILES['image']
        searched_image = Image.open(uploaded_image)
        query_features = extract_features(searched_image)
        threshold = 100
        features_list = extract_features_mobiles()

        matched_mobiles = []
        for i, features in enumerate(features_list):
            distance = np.linalg.norm(query_features - features)
            if distance < threshold:
                matched_mobiles.append(Mobile.objects.all()[i])

        serializer = MobileSerializer(matched_mobiles, many=True)
        for mobile in serializer.data:
            mobile['image'] = request.build_absolute_uri(mobile['image'])
        return Response(serializer.data, status=status.HTTP_200_OK)


class MobileTypeViewSet(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer

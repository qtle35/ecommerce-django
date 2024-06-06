import numpy as np
from PIL import Image
from extract_features import *
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import *


class ClothesViewSet(viewsets.ModelViewSet):
    queryset = Clothes.objects.all().order_by('id')
    serializer_class = ClothesSerializer

    @action(detail=True, methods=['get'])
    def search_clothes(self, request, pk=None):
        query = request.query_params.get('query', None)
        if query:
            clothes = Clothes.objects.filter(name__icontains=query).order_by('id')
            serializer = ClothesSerializer(clothes, many=True)
            for cloth in serializer.data:
                cloth['image'] = request.build_absolute_uri(cloth['image'])
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def search_clothes_by_image(self, request, pk=None):
        uploaded_image = request.FILES['image']
        searched_image = Image.open(uploaded_image)
        query_features = extract_features(searched_image)
        threshold = 100
        features_list = extract_features_clothes()

        matched_clothes = []
        for i, features in enumerate(features_list):
            distance = np.linalg.norm(query_features - features)
            if distance < threshold:
                matched_clothes.append(Clothes.objects.all()[i])

        serializer = ClothesSerializer(matched_clothes, many=True)
        for cloth in serializer.data:
            cloth['image'] = request.build_absolute_uri(cloth['image'])
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClothesProducerViewSet(viewsets.ModelViewSet):
    queryset = Producer.objects.all()
    serializer_class = ProducerSerializer


class ClothesStyleViewSet(viewsets.ModelViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer

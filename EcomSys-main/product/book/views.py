import numpy as np
from PIL import Image
from extract_features import *
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import *


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('id')
    serializer_class = BookSerializer

    @action(detail=True, methods=['get'])
    def search_book(self, request, pk=None):
        query = request.query_params.get('query', None)
        if query:
            books = Book.objects.filter(name__icontains=query).order_by('id')
            serializer = BookSerializer(books, many=True)
            for book in serializer.data:
                book['image'] = request.build_absolute_uri(book['image'])
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def search_book_by_image(self, request, pk=None):
        uploaded_image = request.FILES['image']
        searched_image = Image.open(uploaded_image)
        query_features = extract_features(searched_image)
        threshold = 100
        features_list = extract_features_books()

        matched_books = []
        for i, features in enumerate(features_list):
            distance = np.linalg.norm(query_features - features)
            if distance < threshold:
                matched_books.append(Book.objects.all()[i])

        serializer = BookSerializer(matched_books, many=True)
        for book in serializer.data:
            book['image'] = request.build_absolute_uri(book['image'])
        return Response(serializer.data, status=status.HTTP_200_OK)

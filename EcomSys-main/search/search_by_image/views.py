import requests
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
class SearchProductByImageAPIView(APIView):
    def post(self, request):
        image = request.FILES.get('image')
        product_type = request.data.get('type')
        data = []

        if not image or not product_type:
            return Response({'error': 'Missing image or productType parameter'}, status=status.HTTP_400_BAD_REQUEST)

        url_mapping = {
            '1': 'books/search-books-by-image/',
            '2': 'mobiles/search-mobiles-by-image/',
            '3': 'clothes/search-clothes-by-image/'
        }

        default_url = 'http://127.0.0.1:8082/'
        url = url_mapping.get(product_type, None)

        if url:
            files = {'image': image}
            try:
                session = requests.Session()
                session.cookies.update(request.COOKIES)
                response = session.get(default_url + url, files=files)
                if response.status_code == 200:
                    data = response.json()
                else:
                    print('Error:', response.status_code)
            except requests.RequestException as e:
                print('Error:', e)

        return Response(data, status=status.HTTP_200_OK)
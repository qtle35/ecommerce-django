import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
class SearchAPI(APIView):
    def get(self, request):
        query = request.GET.get('query')
        product_type = request.GET.get('type')
        data = []

        if not query or not product_type:
            return Response({'error': 'Missing query or productType parameter'}, status=status.HTTP_400_BAD_REQUEST)

        url_mapping = {
            '1': 'books/search-books/',
            '2': 'mobiles/search-mobiles/',
            '3': 'clothes/search-clothes/'
        }

        default_url = 'http://127.0.0.1:8082/'
        url = url_mapping.get(product_type, None)

        if url:
            params = {'query': query}
            try:
                session = requests.Session()
                session.cookies.update(request.COOKIES)
                response = session.get(default_url + url, params=params)
                if response.status_code == 200:
                    data = response.json()
                else:
                    print('Error:', response.status_code)
            except requests.RequestException as e:
                print('Error:', e)

        return Response(data, status=status.HTTP_200_OK)

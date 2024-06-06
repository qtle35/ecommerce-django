import os

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import speech_recognition as sr
import tempfile
import requests


class SearchProductByVoiceAPIView(APIView):
    def post(self, request):
        voice = request.FILES.get('voice')
        product_type = request.data.get('type')
        data = []

        if not voice or not product_type:
            return Response({'error': 'Missing voice file or productType parameter'},
                            status=status.HTTP_400_BAD_REQUEST)

        recognizer = sr.Recognizer()
        try:
            with sr.AudioFile(voice) as source:
                audio_data = recognizer.record(source)
                text = recognizer.recognize_google(audio_data, language='vi-VN')

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        url_mapping = {
            '1': 'books/search-books/',
            '2': 'mobiles/search-mobiles/',
            '3': 'clothes/search-clothes/'
        }

        default_url = 'http://127.0.0.1:8082/'
        url = url_mapping.get(product_type, None)

        if url:
            try:
                session = requests.Session()
                session.cookies.update(request.COOKIES)
                response = session.get(default_url + url, params={'query': text})
                if response.status_code == 200:
                    data = response.json()
                else:
                    return Response({'error': f'Error from product search service: {response.status_code}'},
                                    status=response.status_code)
            except requests.RequestException as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data, status=status.HTTP_200_OK)

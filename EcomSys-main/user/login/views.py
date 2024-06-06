from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import jwt
import datetime
from rest_framework.views import APIView

from user_info.models import User
from user_info.serializers import UserSerializer


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if email is None or password is None:
        return Response({'error': 'Vui lòng cung cấp email và mật khẩu'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Email hoặc mật khẩu không đúng'}, status=status.HTTP_401_UNAUTHORIZED)

    payload = {
        'user_id': user.pk,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=120),
        'iat': datetime.datetime.utcnow()
    }

    token = jwt.encode(payload, 'secret', algorithm='HS256')
    response_data = {
        'token': token,
        'user_id': user.pk
    }

    response = Response(response_data, status=status.HTTP_200_OK)
    response.set_cookie('token', token, httponly=True)
    return response


class DecodeToken(APIView):
    def get(self, request):
        token = request.headers.get('Authorization')
        if not token:
            return Response({'error': 'Vui lòng đăng nhập!'}, status=status.HTTP_401_UNAUTHORIZED)

        token = token.split('Bearer ')[1] if token.startswith('Bearer ') else None
        try:
            decoded_payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            user_id = decoded_payload['user_id']
            user = User.objects.get(pk=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token hết hạn, vui lòng đăng nhập lại.'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Token không hợp lệ, vui lòng đăng nhập lại.'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Người dùng không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)

from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import CartItem
from .serializers import CartItemSerializer


# Create your views here.
class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all().order_by('date_added')
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        user_id = request.data.get('user_id')
        product_type = request.data.get('product_type')
        existing_cart_item = CartItem.objects.filter(
            product_id=product_id,
            user_id=user_id,
            product_type=product_type
        ).exists()
        if existing_cart_item:
            return Response({"error": "Sản phẩm đã có trong giỏ hàng"}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

from django.shortcuts import render
from rest_framework import viewsets

from .models import Payment
from .serializers import PaymentSerializer


# Create your views here.
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

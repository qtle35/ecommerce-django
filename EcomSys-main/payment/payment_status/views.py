from rest_framework import viewsets

from .models import PaymentStatus
from .serializers import PaymentStatusSerializer


# Create your views here.
class PaymentStatusViewSet(viewsets.ModelViewSet):
    queryset = PaymentStatus.objects.all()
    serializer_class = PaymentStatusSerializer

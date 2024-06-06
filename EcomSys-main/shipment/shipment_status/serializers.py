from rest_framework import serializers
from .models import ShipmentStatus


class ShipmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentStatus
        fields = '__all__'

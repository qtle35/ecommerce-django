from rest_framework import serializers

from .models import Mobile, Type


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

class MobileSerializer(serializers.ModelSerializer):
    type = TypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Type.objects.all(), source='type')

    class Meta:
        model = Mobile
        fields = ['id', 'image', 'name', 'producer', 'type', 'quantity', 'type_product',
                   'price', 'type_id']


from django.apps import apps
from django.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class Shipment(models.Model):
    payment_status_id = models.PositiveBigIntegerField()
    user_id = models.PositiveBigIntegerField()
    client_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    products = ArrayField(models.PositiveBigIntegerField())
    products_type = ArrayField(models.PositiveBigIntegerField())
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shipment_updates'

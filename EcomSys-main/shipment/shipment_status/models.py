from django.db import models
from shipment_updates.models import Shipment


# Create your models here.
class ShipmentStatus(models.Model):
    shipment = models.OneToOneField(Shipment, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, default="Pending")

    class Meta:
        db_table = 'shipment_status'

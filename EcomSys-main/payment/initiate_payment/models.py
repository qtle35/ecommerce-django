from django.contrib.postgres.fields import ArrayField
from django.db import models


# Create your models here.
class Payment(models.Model):
    user_id = models.PositiveBigIntegerField(blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    cart_items = ArrayField(models.PositiveBigIntegerField())
    total_price = models.BigIntegerField()
    payment_mode = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'init_payment'

    def __str__(self):
        return f"Payment {self.pk} by {self.username}"

from django.db import models
from initiate_payment.models import Payment


# Create your models here.
class PaymentStatus(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payment_status'

    def __str__(self):
        return self.payment.__str__()

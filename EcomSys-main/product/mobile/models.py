from djongo import models


# Create your models here.
class Type(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'mobile_type'

    def __str__(self):
        return self.name


class Mobile(models.Model):
    image = models.ImageField(upload_to='images/')
    name = models.CharField(max_length=50)
    producer = models.CharField(max_length=50)
    type = models.ForeignKey(to=Type, on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField()
    price = models.BigIntegerField()
    type_product = models.CharField(max_length=50, default='mobile')

    class Meta:
        db_table = 'mobiles'

    def __str__(self):
        return self.name

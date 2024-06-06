from djongo import models


# Create your models here.
class Producer(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'clothes_producer'

    def __str__(self):
        return self.name


class Style(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'clothes_style'

    def __str__(self):
        return self.name


class Clothes(models.Model):
    image = models.ImageField(upload_to='images/')
    name = models.CharField(max_length=50)
    producer = models.ForeignKey(to=Producer, null=True, on_delete=models.CASCADE)
    style = models.ForeignKey(to=Style, null=True, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    price = models.BigIntegerField()
    type_product = models.CharField(max_length=50, default='close')

    class Meta:
        db_table = 'clothes'

    def __str__(self):
        return self.name

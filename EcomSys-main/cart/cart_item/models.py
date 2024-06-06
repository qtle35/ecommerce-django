from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.db import models


class CartItem(models.Model):
    product_id = models.IntegerField()
    user_id = models.IntegerField()
    product_type = models.IntegerField()
    date_added = models.DateTimeField(auto_now_add=True)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cart_items'

    def get_product(self):
        try:
            if self.product_type == 1:
                product_model = apps.get_model(app_label='product.book', model_name='Book')
            elif self.product_type == 2:
                product_model = apps.get_model(app_label='product.mobile', model_name='Mobile')
            elif self.product_type == 3:
                product_model = apps.get_model(app_label='product.clothes', model_name='Clothes')
            else:
                return None

            product = product_model.objects.get(id=self.product_id)
            return product
        except (LookupError, ObjectDoesNotExist):
            return None

    @property
    def subtotal(self):
        product = self.get_product()
        if product:
            return self.quantity * product.price
        return 0

    def __str__(self):
        product = self.get_product()
        if product:
            return product.name
        return "Unknown"

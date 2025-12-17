from django.db import models
from django.contrib.auth.models import User

# Import your food models
from food_app.models import food, veg, starters, cooldrinks


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_id = models.PositiveIntegerField()
    item_type = models.CharField(max_length=20)  # 'food', 'veg', 'starters', 'cooldrinks'
    item_name = models.CharField(max_length=200)
    item_image = models.URLField()
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item_id', 'item_type')
        ordering = ['-date_added']

    def __str__(self):
        return f"{self.quantity} × {self.item_name}"

    def subtotal(self):
        return self.item_price * self.quantity

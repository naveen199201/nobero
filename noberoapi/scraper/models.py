from django.db import models

# Create your models here.

class Product(models.Model):
    url = models.URLField(unique=True)
    title = models.CharField(max_length=255)
    price = models.CharField(max_length=50)
    mrp = models.CharField(max_length=25)
    last_7_day_sale = models.CharField(max_length=25)
    available_skus = models.TextField()
    description = models.TextField()
    specifications = models.TextField()
    img = models.TextField()

    def __str__(self):
        return self.title

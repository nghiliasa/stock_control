from django.db import models

# Create your models here.

class Category(models.Model):
	name = models.CharField(max_length=60)
	created = models.DateTimeField(auto_now_add=True)
	last_updated = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name='category'
		verbose_name_plural='categories'

	def __str__(self):
		return self.name

class Item(models.Model):
    name = models.CharField(max_length=60)
    reference_code = models.CharField(max_length=60)
    price = models.DecimalField(null=True, blank=True, max_digits=9, decimal_places=2)
    stock = models.PositiveIntegerField(null=True, blank=True)
    category = models.ManyToManyField(Category)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name='item'
        verbose_name_plural='items'

    def __str__(self):
        return self.name
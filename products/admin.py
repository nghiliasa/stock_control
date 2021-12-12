from django.contrib import admin
from .models import Category, Item

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'last_updated')
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
    fieldsets = (
        (None, {'fields': ('name',)}),
        ('Dates', {'fields': ('created', 'last_updated')}),
    )

class ItemAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'last_updated',)
    list_display = ('reference_code', 'name', 'price', 'stock',)
    list_filter = ('category',)
    search_fields = ('name',)
    ordering = ('name',)
    fieldsets = (
        (None, {'fields': ('reference_code', 'name', 'price', 'stock', 'category',)}),
        ('Dates', {'fields': ('created', 'last_updated')}),
    )
    
admin.site.register(Category, CategoryAdmin)
admin.site.register(Item, ItemAdmin)
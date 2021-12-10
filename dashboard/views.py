from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from products.models import Category, Item

# Create your views here.

@login_required(login_url='/login/')
def dashboard(request):
    categories = Category.objects.all()
    products = Item.objects.all()
    context = {'categories' : categories, 'products' : products}
    return render(request, "dashboard/products.html", context)
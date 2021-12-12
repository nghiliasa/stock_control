from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.generic import View
from django.http import HttpResponse
import json
from products.models import Category, Item

# Create your views here.

class Datos(View):
    def get(self, request):
        if request.is_ajax:
            datas={}
            results = []
            if request.GET.get('item'):
                if request.GET.get('item')=='all_item':
                    item = Item.objects.all()
                else:
                    item_id = int(request.GET['item'])
                    item = Item.objects.filter(id=item_id)
                for i in item:
                    data = {}
                    if not i.category:
                        cat_item=0
                    else:
                        cat_item=str(i.category.id)
                    data['category'] = int(cat_item)
                    if cat_item == 0:
                        data['category_name'] = ""
                    else:						
                        data['category_name'] = i.category.name
                    data['id'] = i.id
                    data['reference_code'] = i.reference_code
                    data['name'] = i.name
                    data['price'] = float(i.price)
                    if i.stock:
                        data['stock'] = int(i.stock)
                    else:
                        data['stock'] = 0
                    results.append(data)
            data_json = json.dumps(results)
        else:
            data_json = "fallo"
        mimetype = "application/json"
        return HttpResponse(data_json, mimetype)

@login_required(login_url='/login/')
def dashboard(request):
    categories = Category.objects.all().order_by('name')
    products = Item.objects.all().order_by('reference_code')
    if request.method == 'DELETE':
        print('llego aca')
        item_id = int(request.DELETE.get('item_id'))
        print(item_id)
        item = Item.objects.get(id=item_id)
        item.delete()
    if request.method == 'POST':
        category_id = int(request.POST['category'])
        category = Category.objects.get(id=category_id)
        reference_code = request.POST['reference_code']
        name = request.POST['name']
        price = float(request.POST['price'])
        stock = int(request.POST['stock'])
        if int(request.POST['item_id']) == 0:
            new_item = Item(
                reference_code=reference_code,
                name=name,
                price=price,
                stock=stock,
                category=category,
            )
            new_item.save()
        else:
            item_id = int(request.POST.get('item_id'))
            item = Item.objects.get(id=item_id)
            item.reference_code = reference_code
            item.name = name
            item.price = price
            item.stock = stock
            item.category = category
            item.save()
    context = {'categories' : categories, 'products' : products}
    return render(request, "dashboard/products.html", context)
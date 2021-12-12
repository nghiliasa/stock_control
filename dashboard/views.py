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
    products = Item.objects.all()
    context = {'categories' : categories, 'products' : products}
    if request.method == 'POST':
        try:
            # ---------- Agrego un producto ----------
            
            if int(request.POST['item_id']) == 0:
                print('llego aca 2')
                category = Category.objects.get(id=int(request.POST['category']))
                new_item = Item(
                    reference_code=request.POST['reference_code'],
                    name=request.POST['name'],
                    price=float(request.POST['price']),
                    stock=int(request.POST['stock']),
                    category=category,
                )
                new_item.save()
                
            # ---------- Modifico un producto ----------
                
            elif int(request.POST['item_id']) > 0 and int(request.POST.get('delete')) == 0:
                print('llego aca 3')
                category = Category.objects.get(id=int(request.POST['category']))
                item_id = int(request.POST.get('item_id'))
                item = Item.objects.get(id=item_id)
                item.reference_code = request.POST['reference_code']
                item.name = request.POST['name']
                item.price = float(request.POST['price'])
                item.stock = int(request.POST['stock'])
                item.category = category
                item.save()
                
            # ---------- Elimino un producto ----------
                
            if int(request.POST.get('delete')) == -1:
                print('llego aca 1')
                item_id = int(request.POST.get('item_id'))
                item = Item.objects.get(id=item_id)
                item.delete()
        except:
            pass
    return render(request, "dashboard/products.html", context)
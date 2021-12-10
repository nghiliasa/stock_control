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
					data['id'] = i.id
					data['reference_code'] = i.reference_code
					data['name'] = i.name
					if not i.category:
						cat_item=0
					else:
						cat_item=str(i.category.id)
					data['category'] = int(cat_item)
					if cat_item == 0:
						data['category_name'] = ""
					else:						
						data['category_name'] = i.category.name
					data['price'] = float(i.price)
					results.append(data)
				data_json = json.dumps(results)
		else:
			data_json = "fallo"
		mimetype = "application/json"
		return HttpResponse(data_json, mimetype)

@login_required(login_url='/login/')
def dashboard(request):
    categories = Category.objects.all()
    products = Item.objects.all()
    context = {'categories' : categories, 'products' : products}
    return render(request, "dashboard/products.html", context)
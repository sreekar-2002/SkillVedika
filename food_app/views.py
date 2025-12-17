from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import food, veg, starters, cooldrinks, banner, imagesb, Homepage
from .food_appforms import nonvegForm, vegForm, startersForm, cooldrinksForm

# Template constants
TEMPLATE_VIEW_ITEMS = 'viewitems.html'
TEMPLATE_ADD_FOOD = 'addfood.html'
TEMPLATE_UPDATE_FOODS = 'updatefoods.html'
TEMPLATE_SEARCH = 'search.html'

#  ============================home page views==================================-----


def show_all_foods(request):
    """
    Display all food items including non-veg, veg, starters, cooldrinks, banners, and images.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered template with all food items
    """
    context = {
        'foods': food.objects.all(),
        'veg': veg.objects.all(),
        'starters': starters.objects.all(),
        'cooldrinks': cooldrinks.objects.all(),
        'banner': banner.objects.all(),
        'images': imagesb.objects.all(),
    }
    return render(request, 'ShowAllFoods.html', context) 

#  ============================home page views==================================-----


def homepage(request):
    """
    Display the homepage with homepage content.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered homepage template
    """
    context = {
        'homepages': Homepage.objects.all(),
    }
    return render(request, 'homepage.html', context)


#----------------viewing contact page-------------------


def contact(request):
    """
    Display the contact page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered contact template
    """
    return render(request, 'contact.html')


def contact_view(request):
    """
    Handle contact form submission.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to contact page with success message or render contact form
    """
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        # You can store or email this info here...
        if name and email and message:
            messages.success(request, 'Your message has been sent successfully!')
            return redirect('contact')

    return render(request, 'contact.html')












    

# ----------==========================================views for viewitems.html==========================================-------


#----------------viewing particular  non-veg items-------------------
@login_required
def foods(request, pk):
    """
    Display details of a specific non-veg food item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the food item
        
    Returns:
        Rendered template with food item details
    """
    nonveg = get_object_or_404(food, id=pk)
    context = {
        'nonveg': nonveg
    }
    return render(request, TEMPLATE_VIEW_ITEMS, context)


#----------------viewing particular  veg items-------------------
@login_required
def vegs(request, pk):
    """
    Display details of a specific veg food item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the veg item
        
    Returns:
        Rendered template with veg item details
    """
    vegf = get_object_or_404(veg, id=pk)
    context = {
        'veg': vegf
    }
    return render(request, TEMPLATE_VIEW_ITEMS, context)


#----------------viewing particular   starters items-------------------
@login_required
def starts(request, pk):
    """
    Display details of a specific starter item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the starter item
        
    Returns:
        Rendered template with starter item details
    """
    start = get_object_or_404(starters, id=pk)
    context = {
        'start': start
    }
    return render(request, TEMPLATE_VIEW_ITEMS, context)


#----------------viewing particular   cool drink items-------------------
@login_required
def cools(request, pk):
    """
    Display details of a specific cooldrink item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the cooldrink item
        
    Returns:
        Rendered template with cooldrink item details
    """
    cool = get_object_or_404(cooldrinks, id=pk)
    context = {
        'cool': cool
    }
    return render(request, TEMPLATE_VIEW_ITEMS, context)


#----------------viewing   about page-------------------


def about(request):
    """
    Display the about page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered about template
    """
    return render(request, 'about.html')



#---------Deleting  particular food details===========--------
@login_required
def deletefood(request, pk):
    """
    Delete a specific non-veg food item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the food item to delete
        
    Returns:
        Redirect to showFood page
    """
    food_item = get_object_or_404(food, id=pk)
    food_item.delete()
    messages.success(request, 'Food item deleted successfully.')
    return redirect('showFood')


@login_required
def deleteveg(request, pk):
    """
    Delete a specific veg food item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the veg item to delete
        
    Returns:
        Redirect to showFood page
    """
    veg_item = get_object_or_404(veg, id=pk)
    veg_item.delete()
    messages.success(request, 'Veg item deleted successfully.')
    return redirect('showFood')


@login_required
def deletestarter(request, pk):
    """
    Delete a specific starter item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the starter item to delete
        
    Returns:
        Redirect to showFood page
    """
    starter_item = get_object_or_404(starters, id=pk)
    starter_item.delete()
    messages.success(request, 'Starter item deleted successfully.')
    return redirect('showFood')


@login_required
def deletecooldrinks(request, pk):
    """
    Delete a specific cooldrink item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the cooldrink item to delete
        
    Returns:
        Redirect to showFood page
    """
    cooldrink_item = get_object_or_404(cooldrinks, id=pk)
    cooldrink_item.delete()
    messages.success(request, 'Cooldrink item deleted successfully.')
    return redirect('showFood')




#---------===================================adding the   Food items through foorms===============================================--------
#================adding the   Nonveg details=============
@login_required
def addnon_veg(request):
    """
    Add a new non-veg food item through form.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to showFood page on success or render form template
    """
    form = nonvegForm()

    if request.method == 'POST':
        form = nonvegForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Non-veg item added successfully.')
            return redirect('showFood')

    context = {
        "form": form
    }
    return render(request, TEMPLATE_ADD_FOOD, context)



#================adding the   veg-Items through forms=============
@login_required
def addveg_item(request):
    """
    Add a new veg food item through form.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to showFood page on success or render form template
    """
    form1 = vegForm()

    if request.method == 'POST':
        form1 = vegForm(request.POST, request.FILES)
        if form1.is_valid():
            form1.save()
            messages.success(request, 'Veg item added successfully.')
            return redirect('showFood')

    context = {
        "form1": form1
    }
    return render(request, TEMPLATE_ADD_FOOD, context)




#================adding the   statrter through forms=============
@login_required
def addstarter_item(request):
    """
    Add a new starter item through form.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to showFood page on success or render form template
    """
    form2 = startersForm()

    if request.method == 'POST':
        form2 = startersForm(request.POST, request.FILES)
        if form2.is_valid():
            form2.save()
            messages.success(request, 'Starter item added successfully.')
            return redirect('showFood')

    context = {
        "form2": form2
    }
    return render(request, TEMPLATE_ADD_FOOD, context)



#================adding the  coolderinks through forms=============
@login_required
def addcooldrink_item(request):
    """
    Add a new cooldrink item through form.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to showFood page on success or render form template
    """
    form3 = cooldrinksForm()

    if request.method == 'POST':
        form3 = cooldrinksForm(request.POST, request.FILES)
        if form3.is_valid():
            form3.save()
            messages.success(request, 'Cooldrink item added successfully.')
            return redirect('showFood')

    context = {
        "form3": form3
    }
    return render(request, TEMPLATE_ADD_FOOD, context)




#---------===================================updating Food items through foorms===============================================--------

#================Updating  the   nonveg(food) details through forms=============
@login_required
def updatenonveg(request, pk):
    """
    Update a specific non-veg food item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the food item to update
        
    Returns:
        Redirect to showFood page on success or render update form template
    """
    food_item = get_object_or_404(food, id=pk)

    if request.method == 'POST':
        form = nonvegForm(request.POST, request.FILES, instance=food_item)
        if form.is_valid():
            form.save()
            messages.success(request, 'Non-veg item updated successfully.')
            return redirect('showFood')
    else:
        form = nonvegForm(instance=food_item)

    context = {
        "form": form
    }
    return render(request, TEMPLATE_UPDATE_FOODS, context)



#================Updating  the   veg items details through forms=============
@login_required
def updatevegfood(request, pk):
    """
    Update a specific veg food item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the veg item to update
        
    Returns:
        Redirect to showFood page on success or render update form template
    """
    veg_item = get_object_or_404(veg, id=pk)

    if request.method == 'POST':
        form1 = vegForm(request.POST, request.FILES, instance=veg_item)
        if form1.is_valid():
            form1.save()
            messages.success(request, 'Veg item updated successfully.')
            return redirect('showFood')
    else:
        form1 = vegForm(instance=veg_item)

    context = {
        "form1": form1
    }
    return render(request, TEMPLATE_UPDATE_FOODS, context)







#================Updating  the   starters details through forms=============
@login_required
def updatestarters(request, pk):
    """
    Update a specific starter item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the starter item to update
        
    Returns:
        Redirect to showFood page on success or render update form template
    """
    starter_item = get_object_or_404(starters, id=pk)

    if request.method == 'POST':
        form2 = startersForm(request.POST, request.FILES, instance=starter_item)
        if form2.is_valid():
            form2.save()
            messages.success(request, 'Starter item updated successfully.')
            return redirect('showFood')
    else:
        form2 = startersForm(instance=starter_item)

    context = {
        "form2": form2
    }
    return render(request, TEMPLATE_UPDATE_FOODS, context)


#================Updating  the   cooldrinks  details through forms=============
@login_required
def updatecooldrink(request, pk):
    """
    Update a specific cooldrink item.
    
    Args:
        request: HTTP request object
        pk: Primary key of the cooldrink item to update
        
    Returns:
        Redirect to showFood page on success or render update form template
    """
    cooldrink_item = get_object_or_404(cooldrinks, id=pk)

    if request.method == 'POST':
        form3 = cooldrinksForm(request.POST, request.FILES, instance=cooldrink_item)
        if form3.is_valid():
            form3.save()
            messages.success(request, 'Cooldrink item updated successfully.')
            return redirect('showFood')
    else:
        form3 = cooldrinksForm(instance=cooldrink_item)

    context = {
        "form3": form3
    }
    return render(request, TEMPLATE_UPDATE_FOODS, context)



#=============================================================search logic=========================--------------=============


@login_required
def search(request):
    """
    Search for food items across all categories.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered search template with results
    """
    if request.method == "GET":
        query = request.GET.get('query', '').strip().lower()

        if not query:
            messages.warning(request, "Search query cannot be empty.")
            return render(request, TEMPLATE_SEARCH, {'results': [], 'query': ''})

        def tag_results(queryset, model_name):
            """
            Tag query results with model type for template rendering.
            
            Args:
                queryset: Django queryset
                model_name: Name of the model type
                
            Returns:
                List of items with model_type attribute
            """
            for item in queryset:
                item.model_type = model_name
            return list(queryset)

        all_results = []

        # Pure keyword filters — only specific datasets returned
        if query in ['veg', 'pure veg']:
            vegresult = tag_results(
                veg.objects.all(),
                'viewvegs'
            )
            all_results = vegresult

        elif query in ['nonveg', 'non-veg', 'non veg']:
            nonvegresult = tag_results(
                food.objects.all(),
                'food'
            )
            all_results = nonvegresult
        elif query in ['starter', 'vegstarter', 'nonvegstarter']:
            starterresult = tag_results(
                starters.objects.all(),
                'viewstarters'
            )
            all_results = starterresult

        else:
            # General search across all models
            nonvegresult = tag_results(
                food.objects.filter(
                    Q(name__icontains=query) |
                    Q(price__icontains=query) |
                    Q(category__icontains=query)
                ), 'food'
            )

            vegresult = tag_results(
                veg.objects.filter(
                    Q(name__icontains=query) |
                    Q(price__icontains=query) |
                    Q(category__icontains=query)
                ), 'viewvegs'
            )

            startersresult = tag_results(
                starters.objects.filter(
                    Q(name__icontains=query) |
                    Q(price__icontains=query) |
                    Q(category__icontains=query)
                ), 'viewstarters'
            )

            cooldrinkresults = tag_results(
                cooldrinks.objects.filter(
                    Q(name__icontains=query) |
                    Q(price__icontains=query) |
                    Q(category__icontains=query)
                ), 'viewcooldrinks'
            )

            all_results = nonvegresult + vegresult + startersresult + cooldrinkresults

        return render(request, TEMPLATE_SEARCH, {
            'results': all_results,
            'query': query
        })

    return render(request, TEMPLATE_SEARCH, {'results': [], 'query': ''})















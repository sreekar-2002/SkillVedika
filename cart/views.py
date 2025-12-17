from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import CartItem
from food_app.models import food, veg, starters, cooldrinks






# -----------------------items adding to the cart----------------------------------------------------------
@login_required
def add_to_cart(request, item_id, item_type):
    """
    Add an item to the user's cart.
    
    Args:
        request: HTTP request object
        item_id: ID of the item to add
        item_type: Type of item ('food', 'veg', 'starters', 'cooldrinks')
        
    Returns:
        Redirect to cart view
    """
    # Map model names to classes
    model_map = {
        'food': food,
        'veg': veg,
        'starters': starters,
        'cooldrinks': cooldrinks,
    }

    if item_type not in model_map:
        messages.error(request, 'Invalid item type.')
        return redirect('showFood')

    # get the item from correct model
    model = model_map[item_type]
    item = get_object_or_404(model, id=item_id)

    # CREATE or UPDATE cart item
    cart_item, created = CartItem.objects.get_or_create(
        user=request.user,
        item_id=item.id,
        item_type=item_type,
        defaults={
            "item_name": item.name,
            "item_image": item.image.url if item.image else "",
            "item_price": item.price,
            "quantity": 1
        }
    )

    # If already exists → increase quantity
    if not created:
        cart_item.quantity += 1
        cart_item.save()
        messages.success(request, f'{item.name} quantity updated in cart.')
    else:
        messages.success(request, f'{item.name} added to cart.')

    return redirect('cart:view_cart')


#-------------------item in the cart-----------------------------------------------
@login_required
def view_cart(request):
    """
    Display the user's cart with all items and total price.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered cart template with cart items and total
    """
    cart_items = CartItem.objects.filter(user=request.user)

    # Calculate subtotal for each item
    for item in cart_items:
        item.subtotal = item.item_price * item.quantity

    total_price = sum(item.subtotal for item in cart_items)

    return render(request, "cart.html", {
        "cart_items": cart_items,
        "total_price": total_price,
        "cart_count": cart_items.count()
    })





@login_required
def update_quantity(request, pk, action):
    """
    Update the quantity of a cart item or remove it.
    
    Args:
        request: HTTP request object
        pk: Primary key of the cart item
        action: Action to perform ('increase', 'decrease', 'remove')
        
    Returns:
        Redirect to cart view
    """
    item = get_object_or_404(CartItem, pk=pk, user=request.user)

    if action == 'increase':
        item.quantity += 1
        item.save()
        messages.success(request, "Cart updated", extra_tags="cart")
    elif action == 'decrease' and item.quantity > 1:
        item.quantity -= 1
        item.save()
        messages.success(request, "Cart updated", extra_tags="cart")
    elif action in ['decrease', 'remove']:
        item.delete()
        messages.success(request, "Item removed from cart", extra_tags="cart")
        return redirect('cart:view_cart')
    else:
        messages.warning(request, "Invalid action", extra_tags="cart")

    return redirect('cart:view_cart')


@login_required
def clear_cart(request):
    """
    Clear all items from the user's cart.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to cart view
    """
    CartItem.objects.filter(user=request.user).delete()
    messages.success(request, "Cart cleared!", extra_tags="cart")
    return redirect('cart:view_cart')

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from cart.models import CartItem


@login_required
def payment_page(request):
    """
    Display the payment page with cart items and total price.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered payment template
    """
    cart_items = CartItem.objects.filter(user=request.user)

    if not cart_items.exists():
        from django.contrib import messages
        from django.shortcuts import redirect
        messages.warning(request, "Your cart is empty.")
        return redirect('cart:view_cart')

    total_price = sum(item.quantity * item.item_price for item in cart_items)

    return render(request, "payment.html", {
        "cart_items": cart_items,
        "total_price": total_price
    })


@login_required
def paysucess(request):
    """
    Display payment success page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered payment success template
    """
    return render(request, "paymentsucess.html")





from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import auth, messages


# ======================== Registration View ===========================
def register(request):
    """
    Handle user registration.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to login on success or render registration form
    """
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password1 = request.POST.get('password1', '')
        password2 = request.POST.get('password2', '')

        if not username or not email or not password1:
            messages.error(request, "All fields are required.", extra_tags="food_authentication")
            return redirect('register')

        if password1 == password2:
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists.", extra_tags="food_authentication")
                return redirect('register')
            elif User.objects.filter(email=email).exists():
                messages.error(request, "Email already registered.", extra_tags="food_authentication")
                return redirect('register')
            else:
                user = User.objects.create_user(username=username, email=email, password=password1)
                user.save()
                messages.success(request, "Account created successfully. Please log in.", extra_tags="food_authentication")
                return redirect('login')
        else:
            messages.error(request, "Passwords do not match.", extra_tags="food_authentication")
            return redirect('register')
    else:
        return render(request, 'register.html')

# ======================== Login View ===========================
def login(request):
    """
    Handle user login.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to showFood on success or render login form
    """
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        if not username or not password:
            messages.error(request, "Username and password are required.", extra_tags="food_authentication")
            return redirect('login')

        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            messages.success(request, "Logged in successfully.", extra_tags="food_authentication")
            return redirect('showFood')
        else:
            messages.error(request, "Invalid credentials.", extra_tags="food_authentication")
            return redirect('login')
    else:
        return render(request, 'login.html')

# ======================== Logout Views ===========================
def logout(request):
    """
    Handle user logout.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to homepage
    """
    if request.method == 'POST':
        auth.logout(request)
        messages.info(request, "Logged out successfully.", extra_tags="food_authentication")
        return redirect('homepage')
    return redirect('homepage')

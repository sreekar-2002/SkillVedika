from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import render, redirect
from .forms import UserUpdateForm, ProfileUpdateForm


@login_required
def profile(request):
    """
    Display user profile.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered profile template
    """
    try:
        user_profile = request.user.profile
    except AttributeError:
        messages.warning(request, "Profile not found. Please update your profile.")
        user_profile = None

    return render(request, "profile.html", {"profile": user_profile})


@login_required
def profile_view(request):
    """
    Handle profile update form submission.
    
    Args:
        request: HTTP request object
        
    Returns:
        Redirect to profile on success or render profile update form
    """
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        try:
            p_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)
        except AttributeError:
            messages.error(request, 'Profile not found. Please contact support.')
            return redirect('profile')

        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('profile')
    else:
        u_form = UserUpdateForm(instance=request.user)
        try:
            p_form = ProfileUpdateForm(instance=request.user.profile)
        except AttributeError:
            messages.warning(request, 'Profile not found. Please create a profile.')
            p_form = None

    return render(request, 'profile.html', {'u_form': u_form, 'p_form': p_form})

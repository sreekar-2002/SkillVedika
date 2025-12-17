from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    bio=models.TextField(blank=True,null=True)

    def __str__(self):
        return self.user.username

    def get_absolute_url(self):
        return reverse('profile')

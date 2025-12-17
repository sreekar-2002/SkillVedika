from django.urls import path
from . import views

urlpatterns = [

    path("payment/", views.payment_page, name="payment"),
    path("sucess/", views.paysucess, name="paysucess"),
    
]
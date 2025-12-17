# # cart/urls.py
# from django.urls import path
# from . import views

app_name = 'cart'

# urlpatterns = [
#     path('cart/', views.view_cart, name='view_cart'),
#     path('add/<int:item_id>/<str:item_type>/', views.add_to_cart, name='add_to_cart'),
#     path('update/<int:pk>/<str:action>/', views.update_quantity, name='update_quantity'),
#     
# ]


from django.urls import path
from . import views

urlpatterns = [
    path("add/<int:item_id>/<str:item_type>/", views.add_to_cart, name="add_to_cart"),
    path("", views.view_cart, name="view_cart"),
    path('clear/', views.clear_cart, name='clear_cart'),
    path('update/<int:pk>/<str:action>/', views.update_quantity, name='update_quantity'),
]


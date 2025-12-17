from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name="homepage"),
    path('menu', views.show_all_foods, name="showFood"),
    


    # viewing the particular items view
    path('food/<int:pk>',views.foods, name='food'),
    path('veg/<int:pk>',views.vegs, name='viewvegs'),
    path('starters/<int:pk>',views.starts, name='viewstarters'), # here name="any variable or name " that is used in the redurected modehref
    path('drinks/<int:pk>',views.cools, name='viewcooldrinks'),

    path('about',views.about, name='about'),
    path('contactus',views.contact, name='contact'),


     #deleting the food object

    path('delete/nonveg/<int:pk>/', views.deletefood, name='delete_food'),
    path('delete/veg/<int:pk>/', views.deleteveg, name='delete_veg'),
    path('delete/starter/<int:pk>/', views.deletestarter, name='delete_starter'),
    path('delete/cooldrinks/<int:pk>/', views.deletecooldrinks, name='delete_cooldrinks'),

    # Adding  the food object

   path('addfood',views.addnon_veg ,name='addnonveg'),
   path('addvegitem',views.addveg_item ,name='addveg'),
   path('addstarter',views.addstarter_item ,name='addstarter'),
   path('addcooldrinks',views. addcooldrink_item ,name='addcooldrink'),
   



    #updating the food object

    path('update/nonveg/<int:pk>/', views.updatenonveg, name='updatenonveg'),
    path('update/veg/<int:pk>/', views.updatevegfood, name='updatevegfood'),
    path('update/starter/<int:pk>/', views.updatestarters, name='updatestarters'),
    path('update/cooldrinks/<int:pk>/', views.updatecooldrink, name='updatecooldrinks'),

   path('search', views.search, name='search'),
]
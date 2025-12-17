from django.contrib import admin
from .models import food,cooldrinks,veg,starters,banner,imagesb,Homepage



class homepageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title1',)  

admin.site.register(Homepage, homepageAdmin)




class foodAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'prepared_time','description')
    list_display_links = ('name','id')
    list_filter = ('id', 'price')
    search_fields = ('id','name',)
    ordering = ('price',)
    list_editable = ('price',)  

admin.site.register(food, foodAdmin)


class vegAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'prepared_time','description')
    list_display_links = ('name','id')
    list_filter = ('id', 'price')
    search_fields = ('id','name',)
    ordering = ('price',)
    list_editable = ('price',)  

admin.site.register(veg, vegAdmin)




class startersAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'prepared_time','description')
    list_display_links = ('name','id')
    list_filter = ('id', 'price')
    search_fields = ('id','name',)
    ordering = ('price',)
    list_editable = ('price',)  

admin.site.register(starters, startersAdmin)




class cooldrinksAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'prepared_time','description')
    list_display_links = ('name','id')
    list_filter = ('id', 'price')
    search_fields = ('id','name',)
    ordering = ('price',)
    list_editable = ('price',)  

admin.site.register(cooldrinks, cooldrinksAdmin)




class bannerAdmin(admin.ModelAdmin):
    list_display = ('f_image',)
    
admin.site.register(banner, bannerAdmin)



class imagesbAdmin(admin.ModelAdmin):
    list_display = ('b_image',)
    
admin.site.register(imagesb, imagesbAdmin)
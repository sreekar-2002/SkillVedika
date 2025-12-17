from django.db import models
from datetime import datetime, time


# ===============Model for Home page==================
class Homepage(models.Model):
    """
    Model for homepage content including image and titles.
    """
    image = models.ImageField(null=False, blank=False)
    title1 = models.CharField(max_length=300, null=False, blank=False)
    title2 = models.CharField(max_length=300, null=False, blank=False, default="second title")

    def __str__(self):
        return self.title1

    class Meta:
        verbose_name = "Homepage"
        verbose_name_plural = "Homepages"


# ------------------------------------------Non-veg model--------------------------------
class Food(models.Model):
    """
    Model for non-vegetarian food items.
    """
    image = models.ImageField(null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=60)
    is_available = models.BooleanField(default=True)
    prepared_time = models.TimeField(default=time)
    added_on = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Food"
        verbose_name_plural = "Foods"
        ordering = ['-added_on']


# Backward compatibility alias
food = Food
    



# --------------------------------------------------------veg model-------------------------------------
class Veg(models.Model):
    """
    Model for vegetarian food items.
    """
    image = models.ImageField(null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=60)
    is_available = models.BooleanField(default=True)
    prepared_time = models.TimeField(default=time)
    added_on = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Veg"
        verbose_name_plural = "Veg Items"
        ordering = ['-added_on']


# Backward compatibility alias
veg = Veg
    

    


# ----------------------------------------starter model================================================
class Starter(models.Model):
    """
    Model for starter food items.
    """
    image = models.ImageField(null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=60)
    is_available = models.BooleanField(default=True)
    prepared_time = models.TimeField(default=time)
    added_on = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Starter"
        verbose_name_plural = "Starters"
        ordering = ['-added_on']


# Backward compatibility alias
starters = Starter
    

# --------------------------------cool drink model --------------------------
class Cooldrink(models.Model):
    """
    Model for cooldrink items.
    """
    image = models.ImageField(null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=60)
    is_available = models.BooleanField(default=True)
    prepared_time = models.TimeField(default=time)
    added_on = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Cooldrink"
        verbose_name_plural = "Cooldrinks"
        ordering = ['-added_on']


# Backward compatibility alias
cooldrinks = Cooldrink
    
class Banner(models.Model):
    """
    Model for banner images.
    """
    f_image = models.ImageField(null=False, blank=False)

    def __str__(self):
        return str(self.f_image)

    class Meta:
        verbose_name = "Banner"
        verbose_name_plural = "Banners"


# Backward compatibility alias
banner = Banner


# images model
class ImageB(models.Model):
    """
    Model for image gallery items.
    """
    b_image = models.ImageField(null=False, blank=False)

    def __str__(self):
        return str(self.b_image)

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"


# Backward compatibility alias
imagesb = ImageB
    

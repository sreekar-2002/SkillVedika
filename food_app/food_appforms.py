from django import forms
from .models import food,veg,starters,cooldrinks




#------------------------foodForm(Non Veg)===------------------------------------
class nonvegForm(forms.ModelForm):
    class Meta:
        model = food
        fields = [
            'image',
            'name',
            'price',
            'description',
            'category',
            'is_available',
            'prepared_time',
            'added_on',
        ]
        widgets = {
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'price': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'category': forms.TextInput(attrs={'class': 'form-control'}),
            'is_available': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'prepared_time': forms.TimeInput(attrs={'class': 'form-control'}),
            'added_on': forms.DateInput(attrs={'class': 'form-control'}),
        }
        




#------------------------VegForm(Veg)===------------------------------------
class vegForm(forms.ModelForm):
    class Meta:
        model = veg
        fields = [
            'image',
            'name',
            'price',
            'description',
            'category',
            'is_available',
            'prepared_time',
            'added_on',
        ]
        widgets = {
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'price': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'category': forms.TextInput(attrs={'class': 'form-control'}),
            'is_available': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'prepared_time': forms.TimeInput(attrs={'class': 'form-control'}),
            'added_on': forms.DateInput(attrs={'class': 'form-control'}),
        }
        

#------------------------StarterForm()===------------------------------------
class startersForm(forms.ModelForm):
    class Meta:
        model = starters
        fields = [
            'image',
            'name',
            'price',
            'description',
            'category',
            'is_available',
            'prepared_time',
            'added_on',
        ]
        widgets = {
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'price': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'category': forms.TextInput(attrs={'class': 'form-control'}),
            'is_available': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'prepared_time': forms.TimeInput(attrs={'class': 'form-control'}),
            'added_on': forms.DateInput(attrs={'class': 'form-control'}),
        }
        


#------------------------cooldrinksForm===------------------------------------
class cooldrinksForm(forms.ModelForm):
    class Meta:
        model = cooldrinks
        fields = [
            'image',
            'name',
            'price',
            'description',
            'category',
            'is_available',
            'prepared_time',
            'added_on',
        ]
        widgets = {
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'price': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'category': forms.TextInput(attrs={'class': 'form-control'}),
            'is_available': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'prepared_time': forms.TimeInput(attrs={'class': 'form-control'}),
            'added_on': forms.DateInput(attrs={'class': 'form-control'}),
        }
        

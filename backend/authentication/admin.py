from django.contrib import admin
from .models import MyUser


class MyUserAdmin(admin.ModelAdmin):
    list_display = ["first_name", "email"]
    list_per_page = 20
    # list_editable = ['first_name', 'last_name',]


admin.site.register(MyUser, MyUserAdmin)


from django.contrib import admin
from .models import Comment, Review, Genre

admin.site.register(Genre)
admin.site.register(Review)
admin.site.register(Comment)


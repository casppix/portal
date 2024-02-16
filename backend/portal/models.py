from django.db import models
from django.utils import timesince
from model_utils import Choices


from authentication.models import MyUser


GENRE = [('History', 'History'), ('Science', 'Science'), ('Mystery', 'Mystery'), ('Biography', 'Biography'),
         ('Science Fiction', 'Science Fiction'), ('Romance', 'Romance'), ('Cookbook', 'Cookbook'), ('Poetry', 'Poetry'),
         ('Essay', 'Essay'), ('Travel', 'Travel'), ('Religion', 'Religion'),
         ('Adventure', 'Adventure'), ('Fantasy', 'Fantasy')]
GENRE_CHOICES = sorted([(item[0], item[0]) for item in GENRE])


class Genre(models.Model):
    name = models.CharField(choices=GENRE_CHOICES, default='History', max_length=20)
    '''
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    '''


class Review(models.Model):
    host = models.ForeignKey(MyUser, on_delete=models.SET_NULL, null=True)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.name

    def timesinceCreated(self):
        return timesince.timesince(self.created)


class Comment(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    body = models.TextField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.body[0:50]





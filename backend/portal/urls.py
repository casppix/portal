from django.urls import path
from .views import ReviewView, GenreView, CreateReviewView, ReviewDetailView, AddCommentView, ReviewViewSearchByGenre, \
    ReviewUserView, DeleteReviewView

urlpatterns = [
    path('review', ReviewView.as_view(), name='review-list'),
    path('genre', GenreView.as_view(), name='genre-list'),
    path('review/add', CreateReviewView.as_view(), name='review-add'),
    path('review/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('comment', AddCommentView.as_view(), name='comment-add'),
    path('search_genre', ReviewViewSearchByGenre.as_view(), name='review-search-by-genre'),
    path('user/<str:host>', ReviewUserView.as_view(), name='user-reviews'),
    path('review/delete/<int:pk>', DeleteReviewView.as_view(), name='delete-review'),
]


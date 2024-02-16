from django.shortcuts import get_object_or_404
from .models import Review, Comment, Genre
from rest_framework import status, viewsets, generics, filters
from rest_framework.response import Response
from .serializers import ReviewSerializer, CommentSerializer, GenreSerializer, CreateReviewSerializer, \
    AddCommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from authentication.models import MyUser
from authentication.permissions import CustomAuthentication


class ReviewView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']


class GenreView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class CreateReviewView(generics.CreateAPIView):
    serializer_class = CreateReviewSerializer


class AddCommentView(generics.CreateAPIView):
    serializer_class = AddCommentSerializer


class ReviewDetailView(generics.RetrieveAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        review = self.get_object()
        comments = Comment.objects.filter(review=review)
        comment_serializer = CommentSerializer(comments, many=True)
        response.data['comments'] = comment_serializer.data
        return response


class ReviewViewSearchByGenre(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['genre__name']


class ReviewUserView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [CustomAuthentication]

    def get_queryset(self):
        host = get_object_or_404(MyUser, email=self.kwargs['host'])
        return Review.objects.filter(host=host)


class DeleteReviewView(generics.DestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer




from rest_framework import serializers
from .models import Review, Comment, Genre, GENRE_CHOICES
from authentication.models import MyUser


class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['email', 'first_name']


class GenreSerializer(serializers.ModelSerializer):
    reviews_count = serializers.SerializerMethodField()
    reviews_all_count = serializers.SerializerMethodField()

    class Meta:
        model = Genre
        fields = ['id', 'name', 'reviews_count', 'reviews_all_count']

    def get_reviews_count(self, obj):
        return Review.objects.filter(genre=obj).count()

    def get_reviews_all_count(self, obj):
        return Review.objects.count()


class CommentSerializer(serializers.ModelSerializer):
    user = MyUserSerializer()

    class Meta:
        model = Comment
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    genre = GenreSerializer()
    host = MyUserSerializer()
    timesinceCreated = serializers.DateTimeField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'host', 'genre', 'name', 'description', 'updated', 'created',
                  'timesinceCreated', 'comments_count']

    def get_comments_count(self, obj):
        return Comment.objects.filter(review=obj).count()


class CreateReviewSerializer(serializers.ModelSerializer):
    host = serializers.SlugRelatedField(slug_field='email', queryset=MyUser.objects.all())
    genre_name = serializers.ChoiceField(choices=GENRE_CHOICES, default='history')

    class Meta:
        model = Review
        fields = ['host', 'name', 'description', 'genre_name']

    def create(self, validated_data):
        genre_name = validated_data.pop('genre_name', None)
        if genre_name:
            genre, _ = Genre.objects.get_or_create(name=genre_name)
            validated_data['genre'] = genre
        return super().create(validated_data)


class AddCommentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='email', queryset=MyUser.objects.all())
    review = serializers.SlugRelatedField(slug_field='id', queryset=Review.objects.all(), write_only=True)

    class Meta:
        model = Comment
        fields = ['user', 'body', 'review']

    def create(self, validated_data):
        review_name = validated_data.pop('review')
        review_instance = Review.objects.get(name=review_name)
        validated_data['review'] = review_instance
        comment = Comment.objects.create(**validated_data)
        return comment



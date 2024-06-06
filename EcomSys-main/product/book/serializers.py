from rest_framework import serializers

from .models import Book, Category, Author, Publisher


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Author.objects.all(), source='author')
    publisher_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Publisher.objects.all(), source='publisher')
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Category.objects.all(), source='categories')

    class Meta:
        model = Book
        fields = ['id', 'image', 'name', 'author', 'publisher', 'quantity', 'type_product',
                  'categories', 'price', 'author_id', 'publisher_id', 'category_ids']

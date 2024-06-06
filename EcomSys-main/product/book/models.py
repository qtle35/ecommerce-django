from djongo import models


class Category(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'book_categories'

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    email = models.EmailField()

    class Meta:
        db_table = 'book_authors'

    def __str__(self):
        return self.name


class Publisher(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    email = models.EmailField()

    class Meta:
        db_table = 'book_publishers'

    def __str__(self):
        return self.name


class Book(models.Model):
    image = models.ImageField(upload_to='images/')
    name = models.CharField(max_length=50)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    categories = models.ManyToManyField(Category)
    price = models.BigIntegerField()
    type_product = models.CharField(max_length=50, default="book")

    class Meta:
        db_table = 'books'

    def __str__(self):
        return self.name

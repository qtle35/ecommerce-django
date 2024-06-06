"""product URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from book.views import *
from clothes.views import *
from mobile.views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'publishers', PublisherViewSet)
router.register(r'books', BookViewSet)
router.register(r'clothes-producers', ClothesProducerViewSet)
router.register(r'clothes-styles', ClothesStyleViewSet)
router.register(r'clothes', ClothesViewSet)
router.register(r'mobiles-types', MobileTypeViewSet)
router.register(r'mobiles', MobileViewSet)

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('product/api/', include(router.urls)),
    path('books/search-books/', BookViewSet.as_view({'get': 'search_book'}), name='search_book'),
    path('books/search-books-by-image/', BookViewSet.as_view({'get': 'search_book_by_image'}), name='search_book_by_image'),
    path('clothes/search-clothes/', ClothesViewSet.as_view({'get': 'search_clothes'}), name='search_clothes'),
    path('clothes/search-clothes-by-image/', ClothesViewSet.as_view({'get': 'search_clothes_by_image'}), name='search_clothes_by_image'),
    path('mobiles/search-mobiles/', MobileViewSet.as_view({'get': 'search_mobiles'}), name='search_mobiles'),
    path('mobiles/search-mobiles-by-image/', MobileViewSet.as_view({'get': 'search_mobiles_by_image'}), name='search_mobiles_by_image'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

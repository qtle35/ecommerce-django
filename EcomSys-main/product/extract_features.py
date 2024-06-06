import numpy as np
import tensorflow as tf
from PIL import Image

from book.models import Book
from clothes.models import Clothes
from mobile.models import Mobile

model = tf.keras.applications.VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))


def extract_features(image):
    preprocessed_image = preprocess_image(image)
    features = model.predict(preprocessed_image)
    features = features.flatten()
    return features


def preprocess_image(image):
    image = image.resize((224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = tf.keras.applications.vgg16.preprocess_input(image)
    return image


def extract_features_products(products):
    features_list = []
    for product in products:
        image = Image.open(product.image)
        features = extract_features(image)
        features_list.append(features)
    return features_list


def extract_features_books():
    all_books = Book.objects.all()
    return extract_features_products(all_books)


def extract_features_clothes():
    all_clothes = Clothes.objects.all()
    return extract_features_products(all_clothes)


def extract_features_mobiles():
    all_mobiles = Mobile.objects.all()
    return extract_features_products(all_mobiles)

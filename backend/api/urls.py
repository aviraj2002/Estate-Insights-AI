from django.urls import path
from . import views

urlpatterns = [
    path("upload/", views.upload_file, name="upload_file"),
    path("areas/", views.list_areas, name="list_areas"),
    path("analyze/", views.analyze, name="analyze"),
    path("price-growth/", views.price_growth, name="price_growth"),
]

from django.conf.urls import url
from django.contrib import admin

from game import views

admin.autodiscover()

urlpatterns = [
    url(r'^socket/$', views.socket)
]

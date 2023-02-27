from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import include, path

from score.views import ScoreViewSet

router = DefaultRouter()
router.register('score', ScoreViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
]

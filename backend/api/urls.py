from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

# Registering the ViewSet
router = DefaultRouter()
router.register(r'portfolio', views.TransactionViewSet, basename='portfolio')

urlpatterns = [
    path('', views.home),
    path('latest-market/', views.latest_market_data, name='latest_market_data'),
    path('stock/<str:symbol>/', views.get_stock_data),
    path('', include(router.urls)),
]

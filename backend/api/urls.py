from django.urls import path
from . import views
urlpatterns=[
    path('', views.home),
    path('latest-market/', views.latest_market_data, name='latest_market_data'),
    path('stock/<str:symbol>/', views.get_stock_data),
    path('stock/', views.stockDetails),
    
]
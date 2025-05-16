from django.shortcuts import render
# All rest framweorks imports
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
# All models
from . models import Transaction
# ALl serializers
from . serializers import TransactionSerializer
# For async
import asyncio
import requests
# for nepse API
# from nepse import Client
from bs4 import BeautifulSoup
# Create your views here.


@api_view(['GET'])
def home(request):
    return Response({'message': "Yestai xa la"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def latest_market_data(request):
    url = "https://merolagani.com/latestMarket.aspx"

    try:
        # Making GET request
        con = requests.get(url)
        soup = BeautifulSoup(con.text, 'lxml')  # Parse the whole page
        # Locate the table
        table = soup.find(
            'table', class_='table table-hover live-trading sortable')

        # Extract headers
        headers = [th.text.strip() for th in table.find_all('th')]

        # Extract data rows
        data = table.find_all(
            'tr', {"class": ["decrease-row", "increase-row", "nochange-row"]})

        # Format data into a list of dictionaries
        result = [
            {headers[index]: cell.text.strip()
             for index, cell in enumerate(row.find_all("td"))}
            for row in data
        ]

        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_stock_data(request, symbol):
    url = "https://merolagani.com/latestMarket.aspx"

    try:
        # Making GET request
        con = requests.get(url)
        soup = BeautifulSoup(con.text, 'lxml')
        table = soup.find(
            'table', class_='table table-hover live-trading sortable')

        # Extract headers
        headers = [th.text.strip() for th in table.find_all('th')]

        # Extract data rows
        data_rows = table.find_all(
            'tr', {"class": ["decrease-row", "increase-row", "nochange-row"]})

        # Search for the stock by symbol
        for row in data_rows:
            columns = row.find_all("td")
            if columns and columns[0].text.strip().lower() == symbol.lower():
                stock_data = {headers[i]: col.text.strip()
                              for i, col in enumerate(columns)}
                return Response(stock_data, status=status.HTTP_200_OK)

        return Response({'error': 'Stock symbol not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TransactionViewSet(viewsets.ModelViewSet):
    """
    A viewset of Transaction
    """
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]
    queryset = Transaction.objects.filter(user="aayush")

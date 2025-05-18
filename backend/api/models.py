from django.db import models
from django.utils import timezone
# Create your models here.


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ("Buy", "Buy"),
        ("Sell", "Sell"),
    ]
    SYMBOLS = [
        ("GHL", "GHL"),
        ("BHL", "BHL"),
        ("CHL", "CHL"),
        ("AKJCL", "AKJCL"),
    ]
    STOCK_TYPES = [
        ("Secondary", "Secondary"),
        ("IPO", "IPO"),
        ("FPO", "FPO"),
        ("Bonus", "Bonus"),
        ("Right", "Right"),
        ("Auction", "Auction"),
    ]
    DP_TYPES = [
        ("Yes", "Yes"),
        ("No", "No"),
    ]
    CGT_TYPES = [
        (0.0, "0%"),
        (5.0, "5%"),
        (7.5, "7.5%"),
        (10.0, "10%"),
    ]

    transaction_type = models.CharField(
        max_length=10, choices=TRANSACTION_TYPES)
    stock_symbol = models.CharField(max_length=10, choices=SYMBOLS)
    quantity = models.IntegerField()
    date = models.DateField(null=True, blank=True)
    type = models.CharField(max_length=20, choices=STOCK_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    dp_charge = models.CharField(max_length=3, choices=DP_TYPES)
    capital_gain_tax = models.FloatField(
        choices=CGT_TYPES)
    # TODO: use dynamic user after making it
    user = models.CharField(max_length=16, blank=True,
                            null=True, default="aayush")

    def __str__(self):
        return f"Transaction of {self.user}:- {self.transaction_type}"

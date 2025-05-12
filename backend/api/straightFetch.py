import requests

def get_daily_trade_stat(security_id):
    url = f"https://nepalstock.onrender.com/securityDailyTradeStat/{security_id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data_list = response.json()
        if not data_list:
            print("No data found for the given security ID.")
            return
        data = data_list[0]  # Access the first item in the list
        print(f"Symbol: {data.get('symbol')}")
        print(f"Open Price: {data.get('open_price')}")
        print(f"High Price: {data.get('high_price')}")
        print(f"Low Price: {data.get('low_price')}")
        print(f"Close Price: {data.get('close_price')}")
        print(f"Last Traded Price (LTP): {data.get('lastTradedPrice')}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    except (ValueError, KeyError, IndexError) as e:
        print(f"Error processing data: {e}")

# Replace '58' with the security ID of the desired stock
get_daily_trade_stat(58)

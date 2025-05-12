from bs4 import BeautifulSoup
import requests
import lxml

url = "https://merolagani.com/latestMarket.aspx"

# Making get request 
con = requests.get(url)
soup = BeautifulSoup(con.text, 'lxml') #whole page code
table = soup.find('table', class_='table table-hover live-trading sortable') #table of url

headers = [i for i in table.find_all('th')]  #data of th tag

data = [j for j in table.find_all('tr', {"class": ["decrease-row", "increase-row", "nochange-row"]})]  #data inside tr tag

# format of list like [{'name': 'GHL', 'LTP': '123'}]

result = [{headers[index]:cell.text for index,cell in enumerate(row.find_all("td"))} for row in data]

print(result)
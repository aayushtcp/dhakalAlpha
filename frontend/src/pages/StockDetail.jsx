"use client"

import { useState, useEffect } from "react"
import { Search, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react"

export default function StockDetails() {
  const [searchInput, setSearchInput] = useState("")
  const [stockName, setStockName] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setStockName(searchInput.trim())
      setHasSearched(true)
    }
  }

  useEffect(() => {
    if (!stockName) return

    async function fetchStockData() {
      setLoading(true)
      setError(null)
      setStockData(null)

      try {
        const apiUrl = `http://127.0.0.1:8000/api/stock/${stockName}/`
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch stock data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setStockData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [stockName])

  const renderContent = () => {
    if (!hasSearched) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Enter a Stock Symbol to Begin</h2>
          <p className="text-gray-600">
            Search for a stock by entering its symbol above (e.g., NABIL, ADBL)
          </p>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white border rounded-lg shadow">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mb-4" />
          <p className="text-lg">Loading stock data for "{stockName}"...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="mt-4 text-gray-700">
            Please check if the stock symbol is correct and the API server is running at http://127.0.0.1:8000
          </p>
        </div>
      )
    }

    if (!stockData) return null

    const isPositive = parseFloat(stockData["% Change"]) >= 0

    return (
      <div className="bg-white border rounded-lg shadow-lg overflow-hidden mt-6">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{stockData["Symbol"]}</h2>
              <p className="text-gray-500">{stockData["Company Name"] || "Stock Details"}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">Rs. {parseFloat(stockData["LTP"] || 0).toFixed(2)}</p>
              <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? (
                  <ArrowUpCircle className="h-5 w-5 mr-1" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 mr-1" />
                )}
                <span className="font-medium">
                  {stockData["% Change"] + " % Changed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {Object.entries(stockData).map(([key, value]) => {
            if (
              ["Stock Symbol", "LTP", "Change", "Percent Change", "Company Name"].includes(key) ||
              !value
            ) {
              return null
            }

            return (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stock Details Viewer</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter stock symbol (e.g., NABIL)"
              className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {renderContent()}
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, Loader2Icon, SearchIcon, XCircleIcon } from "lucide-react"

const AllData = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://127.0.0.1:8000/api/latest-market/")
        setData(response.data)
        setFilteredData(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch data. Please try again later.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data)
    } else {
      const filtered = data.filter((stock) => stock.Symbol.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredData(filtered)
    }
  }, [searchTerm, data])

  const getRowColor = (percentChange) => {
    const change = Number.parseFloat(percentChange)
    if (change === 0) return "bg-amber-200"
    if (change > 0) return "bg-green-200"
    return "bg-red-200"
  }

  const getChangeIcon = (percentChange) => {
    const change = Number.parseFloat(percentChange)
    if (change === 0) return <MinusIcon className="inline h-4 w-4" />
    if (change > 0) return <ArrowUpIcon className="inline h-4 w-4 text-green-600" />
    return <ArrowDownIcon className="inline h-4 w-4 text-red-600" />
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2Icon className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-lg">Loading data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by Symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-xl p-10">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">LTP</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                % Change
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Open</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">High</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Low</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Qty.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((stock, index) => (
                <tr key={index} className={`${getRowColor(stock["% Change"])} hover:bg-opacity-80 transition-colors`}>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{stock.Symbol}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">{stock.LTP}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">
                    {getChangeIcon(stock["% Change"])} <span className="ml-1">{stock["% Change"]}%</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">{stock.Open}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">{stock.High}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">{stock.Low}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">{stock["Qty."]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-8 py-10 text-center text-gray-500">
                  No stocks found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Data count */}
      <div className="text-right text-sm text-gray-500 pr-2">
        Showing {filteredData.length} of {data.length} stocks
      </div>
    </div>
  )
}

export default AllData

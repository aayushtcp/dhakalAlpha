import { useEffect, useState } from "react";
import axios from "axios";
import { usePortfolio } from "../services/PortfolioContext";

const PortfolioValue = () => {
  const { portfoliobycontext } = usePortfolio();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [stockDetails, setStockDetails] = useState([]);

  useEffect(() => {
    if (portfoliobycontext) {
      setPortfolio(portfoliobycontext);
    }
  }, [portfoliobycontext]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/latest-market/");
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

useEffect(() => {
  if (portfolio.length && data.length) {
    const holdings = {};

    // Aggregate holdings by symbol, accounting for buy and sell transactions
    portfolio.forEach(({ stock_symbol, transaction_type, quantity }) => {
      const symbol = stock_symbol.trim().toUpperCase();

      // Initialize holding if not present
      if (!holdings[symbol]) {
        holdings[symbol] = 0;
      }

      // Add or subtract quantity based on transaction type
      if (transaction_type === "Buy") {
        holdings[symbol] += Number(quantity);
      } else if (transaction_type === "Sell") {
        holdings[symbol] -= Number(quantity);
      }
    });

    let total = 0;
    const details = [];

    Object.entries(holdings).forEach(([symbol, qty]) => {
      if (qty > 0) {
        const stock = data.find(d => d.Symbol.trim().toUpperCase() === symbol);
        if (stock) {
          const cleanLTP = Number(stock.LTP.replace(/,/g, ""));
          const value = qty * cleanLTP;
          total += value;
          details.push({ symbol, quantity: qty, ltp: cleanLTP, currentValue: value });
        }
      }
    });

    setTotalValue(total);
    setStockDetails(details);
  }
}, [portfolio, data]);



  if (loading) return <div className="p-6">Loading market data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="p-6 min-h-screen bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Portfolio</h2>
        <p className="text-gray-600">No portfolio data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Portfolio Value</h2>
      <p className="text-xl font-bold text-green-600 mb-4">
        Total Current Value: Rs. {totalValue.toFixed(2)}
      </p>

      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Symbol</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">LTP</th>
            <th className="px-4 py-2 text-left">Current Value</th>
          </tr>
        </thead>
        <tbody>
          {stockDetails.map((stock, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2">{stock.symbol}</td>
              <td className="px-4 py-2">{stock.quantity}</td>
              <td className="px-4 py-2">{stock.ltp}</td>
              <td className="px-4 py-2">{stock.currentValue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioValue;

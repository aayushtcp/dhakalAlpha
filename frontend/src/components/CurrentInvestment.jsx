import React, { useEffect, useState } from "react";
import { usePortfolio } from "../services/PortfolioContext";

const CurrentInvestment = () => {
  const { portfoliobycontext } = usePortfolio();
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (portfoliobycontext) {
      setPortfolio(portfoliobycontext);
    }
  }, [portfoliobycontext]);

  const getBrokerRate = (amount) => {
    if (amount <= 50000) return 0.0036; // 0.4%
    else if (amount <= 500000) return 0.0037; // 0.37%
    else if (amount <= 2000000) return 0.0034; // 0.34%
    else if (amount <= 10000000) return 0.003; // 0.30%
    else return 0.0027; // 0.27%
  };

  const getCommission = (total) => total * getBrokerRate(total);

  const investments = {};

  portfolio.forEach((item) => {
    const symbol = item.stock_symbol.trim().toUpperCase();
    const qty = parseFloat(item.quantity || 0);
    const price = parseFloat(item.price || 0);
    const total = qty * price;

    const sebon = total * 0.00015;
    const commission = getCommission(total);
    const dp = 25;
    const amountPaid = total + sebon + commission + dp;
    const effectiveRate = amountPaid / qty;

    if (!investments[symbol]) {
      investments[symbol] = { qty: 0, totalValue: 0 };
    }

    if (item.transaction_type === "Buy") {
      investments[symbol].qty += qty;
      investments[symbol].totalValue += qty * effectiveRate;
    } else if (item.transaction_type === "Sell") {
      // Deduct proportionally based on avg rate
      const avgRate =
        investments[symbol].qty > 0
          ? investments[symbol].totalValue / investments[symbol].qty
          : 0;
      investments[symbol].qty -= qty;
      investments[symbol].totalValue -= qty * avgRate;
      if (investments[symbol].qty < 0) investments[symbol].qty = 0;
      if (investments[symbol].totalValue < 0)
        investments[symbol].totalValue = 0;
    }
  });


  const currentInvestment = Object.values(investments).reduce(
    (acc, stock) => acc + stock.totalValue,
    0
  );

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          NO INFORMATION
        </h2>
        <p className="text-gray-600">No portfolio data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Current Investment
      </h2>
      <p className="text-lg text-gray-700">
        Rs. {currentInvestment.toFixed(2)}
      </p>
    </div>
  );
};

export default CurrentInvestment;

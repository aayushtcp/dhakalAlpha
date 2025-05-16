import React, { useEffect, useState } from "react";
import { usePortfolio } from "../services/PortfolioContext";
import { Edit2, Trash2 } from "lucide-react";

// Helper to get broker rate based on total amount
const getBrokerRate = (amount) => {
  if (amount <= 50000) return 0.004;
  else if (amount <= 500000) return 0.0037;
  else if (amount <= 2000000) return 0.0034;
  else if (amount <= 10000000) return 0.003;
  else return 0.0027;
};

// Calculate actual commission (excluding VAT)
const getCommission = (amount) => {
  const rate = getBrokerRate(amount);
  return amount * (rate / 1.13);
};

const BuyHistory = () => {
  const { portfoliobycontext } = usePortfolio();
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (portfoliobycontext) {
      setPortfolio(portfoliobycontext);
    }
  }, [portfoliobycontext]);

  const buyPortfolio = portfolio.filter(
    (item) => item.transaction_type === "Buy"
  );

  if (!buyPortfolio || buyPortfolio.length === 0) {
    return (
      <div className="p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buy Portfolio</h2>
        <p className="text-gray-600">No Buy data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Portfolio Buy History</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="py-3 px-4 text-left font-semibold">Action</th>
              <th className="py-3 px-4 text-left font-semibold">Symbol</th>
              <th className="py-3 px-4 text-left font-semibold">Date</th>
              <th className="py-3 px-4 text-left font-semibold">Type</th>
              <th className="py-3 px-4 text-left font-semibold">Quantity</th>
              <th className="py-3 px-4 text-left font-semibold">Purchase Price</th>
              <th className="py-3 px-4 text-left font-semibold">SEBON</th>
              <th className="py-3 px-4 text-left font-semibold">Commission</th>
              <th className="py-3 px-4 text-left font-semibold">DP Charge</th>
              <th className="py-3 px-4 text-left font-semibold">Amount Paid</th>
              <th className="py-3 px-4 text-left font-semibold">Effective Rate</th>
            </tr>
          </thead>
          <tbody>
            {buyPortfolio.map((item, idx) => {
              const qty = parseFloat(item.quantity || 0);
              const price = parseFloat(item.purchase_price || 0);
              const total = qty * price;

              const sebon = total * 0.00015;
              const brokerRate = getBrokerRate(total);
              const commission = getCommission(total);
              const dp = 25;
              const amountPaid = total + sebon + commission + dp;
              const effectiveRate = amountPaid / qty;

              return (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-4 flex gap-2 items-center">
                    <button type="button" className="text-blue-500 hover:text-blue-700" title="Edit">
                      <Edit2 size={20} />
                    </button>
                    <button type="button" className="text-red-500 hover:text-red-700" title="Delete">
                      <Trash2 size={20} />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">{item.stock_symbol || "-"}</td>
                  <td className="py-2 px-4 border-b">{item.purchase_date || "-"}</td>
                  <td className="py-2 px-4 border-b">{item.type || "-"}</td>
                  <td className="py-2 px-4 border-b">{qty}</td>
                  <td className="py-2 px-4 border-b">{price.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{sebon.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{commission.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{dp.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{amountPaid.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{effectiveRate.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyHistory;

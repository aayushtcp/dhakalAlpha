import React, { useEffect, useState } from "react";
import { usePortfolio } from "../services/PortfolioContext";
import { Edit2, Trash2 } from "lucide-react";

const SellHistory = () => {
  const { portfoliobycontext } = usePortfolio();
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (portfoliobycontext) {
      setPortfolio(portfoliobycontext);
    }
  }, [portfoliobycontext]);

  // Filter only "Buy" transactions
  const buyPortfolio = portfolio.filter(
    (item) => item.transaction_type === "Sell"
  );

  if (!buyPortfolio || buyPortfolio.length === 0) {
    return (
      <div className="p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sell Data</h2>
        <p className="text-gray-600">No sell data available.</p>
      </div>
    );
  }
return (
    <div className="p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Portfolio Sell History</h2>
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-red-600 text-white">
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
                    {buyPortfolio.map((item, idx) => (
                        <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                            <td className="py-3 px-4 flex gap-2 items-center">
                                {/* Edit Icon */}
                                <button
                                    type="button"
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Edit"
                                >
                                    <Edit2 size={20} />
                                </button>
                                {/* Delete Icon */}
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b">{item.stock_symbol || "-"}</td>
                            <td className="py-2 px-4 border-b">{item.purchase_date || "-"}</td>
                            <td className="py-2 px-4 border-b">{item.type || "-"}</td>
                            <td className="py-2 px-4 border-b">{item.quantity || "-"}</td>
                            <td className="py-2 px-4 border-b">{item.purchase_price || "-"}</td>
                            <td className="py-2 px-4 border-b">0</td>
                            <td className="py-2 px-4 border-b">0</td>
                            <td className="py-2 px-4 border-b">0</td>
                            <td className="py-2 px-4 border-b">0</td>
                            <td className="py-2 px-4 border-b">0</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
};

export default SellHistory;

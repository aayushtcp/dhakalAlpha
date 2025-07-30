import React, { useEffect, useState } from "react";
import { usePortfolio } from "../services/PortfolioContext";
import { Edit2, Trash2 } from "lucide-react";

// Helper to get broker rate based on total amount
const getBrokerRate = (amount) => {
  if (amount <= 50000) return 0.0036; // 0.4%
  else if (amount <= 500000) return 0.0037; // 0.37%
  else if (amount <= 2000000) return 0.0034; // 0.34%
  else if (amount <= 10000000) return 0.003; // 0.30%
  else return 0.0027; // 0.27%
};
const getCommission = (amount) => {
  const rateWithVAT = getBrokerRate(amount);
  //! const baseRate = rateWithVAT / 1.13;
  const commission = amount * rateWithVAT;
  return parseFloat(commission.toFixed(2));
};

const calculateCGT = (
  purchasePrice,
  sellingPrice,
  quantity,
  commission,
  taxRate
) => {
  const capitalGain =
    sellingPrice * quantity - purchasePrice * quantity - commission;
  if (capitalGain <= 0) return 0;
  return +(capitalGain * (taxRate / 100)).toFixed(2);
};

const calculateProfit = (
  purchasePrice,
  sellingPrice,
  cgt,
  commission,
  sebon,
  dp,
  quantity
) => {
  const capitalGain =
    sellingPrice * quantity - purchasePrice * quantity - commission;

  if (capitalGain <= 0) return 0;

  return +(capitalGain - cgt - dp).toFixed(2);
};
const SellHistory = () => {
  const { portfoliobycontext } = usePortfolio();
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (portfoliobycontext) {
      setPortfolio(portfoliobycontext);
    }
  }, [portfoliobycontext]);

  const SellPortfolio = portfolio.filter(
    (item) => item.transaction_type === "Sell"
  );

  if (!SellPortfolio || SellPortfolio.length === 0) {
    return (
      <div className="p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Sell Portfolio
        </h2>
        <p className="text-gray-600">No Sell data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Portfolio Sell History
      </h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="py-3 px-4 text-left font-semibold">Action</th>
              <th className="py-3 px-4 text-left font-semibold">Symbol</th>
              <th className="py-3 px-4 text-left font-semibold">Date</th>
              <th className="py-3 px-4 text-left font-semibold">Type</th>
              <th className="py-3 px-4 text-left font-semibold">Quantity</th>
              <th className="py-3 px-4 text-left font-semibold">Sell Amount</th>
              <th className="py-3 px-4 text-left font-semibold">Sell Price</th>
              <th className="py-3 px-4 text-left font-semibold">Commission</th>
              <th className="py-3 px-4 text-left font-semibold">SEBON Fees</th>
              <th className="py-3 px-4 text-left font-semibold">DP Charge</th>
              <th className="py-3 px-4 text-left font-semibold">CGT</th>
              <th className="py-3 px-4 text-left font-semibold">Net Receive</th>
              <th className="py-3 px-4 text-left font-semibold">
                Profit Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {SellPortfolio.map((item, idx) => {
              const qty = parseFloat(item.quantity || 0);
              const price = parseFloat(item.price || 0);
              const total = qty * price;

              const sebon = total * 0.00015;
              const brokerRate = getBrokerRate(total);
              const commission = getCommission(total);
              const dp = 25;
              const amountPaid = total + sebon + commission + dp;
              const effectiveRate = amountPaid / qty;
              const taxrate = parseFloat(item.capital_gain_tax || 7.5);

              // Fallback to 0 if data is not present
              const sellAmount = total || 0;
              const sellPrice = price || 0;
              //   const cgt =
              //     ((parseFloat(item.capital_gain_tax) || 0) * total) / 100;
              const cgt = calculateCGT(
                223.85,
                sellPrice,
                qty,
                commission,
                taxrate
              );
              const netReceive = total - commission - sebon - dp - cgt || 0;
              const profitAmount = calculateProfit(
                223.85,
                sellPrice,
                cgt,
                commission,
                sebon,
                dp,
                qty
              );

              return (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-3 px-4 flex gap-2 items-center">
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.stock_symbol || "0"}
                  </td>
                  <td className="py-2 px-4 border-b">{item.date || "0"}</td>
                  <td className="py-2 px-4 border-b">{item.type || "0"}</td>
                  <td className="py-2 px-4 border-b">{qty || 0}</td>
                  <td className="py-2 px-4 border-b">
                    {sellAmount.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">{sellPrice.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {commission ? commission.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {sebon ? sebon.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {dp ? dp.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {cgt ? cgt.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {netReceive ? netReceive.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {profitAmount ? profitAmount.toFixed(2) : "0.00"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellHistory;

import React, { useEffect, useState } from "react";
import { usePortfolio } from "../services/PortfolioContext";
import BuyHistory from "../components/BuyHistory";
import SellHistory from "../components/SellHistory";
import Navbar from "../components/Navbar";

const Portfolio = () => {
  const { portfoliobycontext } = usePortfolio();
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (portfoliobycontext) {
      setPortfolio(portfoliobycontext);
    }
  }, [portfoliobycontext]);

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="p-6 min-h-screen bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Portfolio</h2>
        <p className="text-gray-600">No portfolio data available.</p>
      </div>
    );
  }

  const headers = Object.keys(portfolio[0]);

  return (
    <>
    <Navbar/>
      <div className="p-6 min-h-screen bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          My Portfolio
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {portfolio.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {item[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BuyHistory />
        <SellHistory />
      </div>
    </>
  );
};

export default Portfolio;

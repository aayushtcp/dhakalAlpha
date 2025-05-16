import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../components/MyUrl";
// import { useUsername } from "./UsernameContext";

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [portfoliobycontext, setPortfoliobycontext] = useState([]);
  // TODO: Username fetch

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // const accessToken = localStorage.getItem("access_token");

        let url = `${API_URL}/portfolio/`;
        let headers = { "Content-Type": "application/json" };

        // if (accessToken && username) {
        //   url = `${API_URL}/${username}/filtered-disasters/`;
        //   headers.Authorization = `Bearer ${accessToken}`;
        // }

        const response = await axios.get(url, { headers });
        setPortfoliobycontext(response.data);
      } catch (error) {
        console.error("Error fetching disasters:", error);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ portfoliobycontext, setPortfoliobycontext }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === null) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

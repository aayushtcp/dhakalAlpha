import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StockDetail from "./pages/StockDetail.jsx";
import Home from "./pages/Home.jsx";

let urls = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/stock-detail",
    element: <StockDetail />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={urls} />
);

import { useEffect, useRef } from 'react';

const TradingChart = () => {
  const containerRef = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        autosize: true,
        symbol: "NASDAQ:AAPL", //symbol
        interval: "D",
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_legend: false,
        container_id: "tradingview-widget-container"
      });
    };

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} style={{ height: "500px" }}>
      <div id="tradingview-widget-container" style={{ height: "100%" }}></div>
    </div>
  );
};

export default TradingChart;

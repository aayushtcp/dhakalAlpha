import React, { useEffect, useState } from "react";
import axios from "axios";
import AllData from "../components/AllData";
import Navbar from "../components/Navbar";
const Home = () => {
  const [message, setMessgae] = useState("NO message");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/`, {});
        setMessgae(response.data.message || "No message received");
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Navbar />
      <AllData />
    </>
  );
};

export default Home;

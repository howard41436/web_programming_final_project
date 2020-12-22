import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function SettlePage() {
  useEffect(() => {
    document.title = "Settle Up | App's name";
  }, []);

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
      </div>
    </div>
  );
}

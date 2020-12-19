/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ChartPage() {
  useEffect(() => {
    document.title = "Charts | App's name";
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
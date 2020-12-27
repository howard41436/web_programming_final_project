import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function BasePage({ children }) {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

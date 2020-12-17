/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function NewItemPage() {
  useEffect(() => {
    document.title = "Tables | App's name";
  }, []);

  return (
    <div className="wrapper">
      <Sidebar active="newitem" />
      <div className="main-panel">
        <Navbar active="newitem" />
      </div>
    </div>
  );
}

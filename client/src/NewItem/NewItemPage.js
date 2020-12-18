/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import NewItemCard from "./NewItemCard";

export default function NewItemPage(props) {
  const { pairId } = props;

  useEffect(() => {
    document.title = "New Item | App's name";
  }, []);

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <NewItemCard pairId={pairId} />
      </div>
    </div>
  );
}

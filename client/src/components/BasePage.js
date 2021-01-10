import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function BasePage(props) {
  const { title, children } = props;

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <Navbar title={title} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

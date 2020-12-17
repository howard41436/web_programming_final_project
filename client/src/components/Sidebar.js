/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { BASENAME } from "../constants";

export default function Sidebar(props) {
  const { active } = props;

  return (
    <div className="sidebar" data-color="white" data-active-color="danger">
      <div className="logo">
        <a className="simple-text logo-mini">
          <div className="logo-image-small">
            <img src={`${BASENAME}img/boy.png`} alt="boy" />
          </div>
        </a>
        <a className="simple-text logo-normal">Tom & Amy</a>
      </div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li className={active === "table" ? "active" : null}>
            <Link to="/">
              <i className="nc-icon nc-money-coins" />
              <p>Our Expenses</p>
            </Link>
          </li>
          <li className={active === "chart" ? "active" : null}>
            <Link to="/charts">
              <i className="nc-icon nc-chart-bar-32" />
              <p>Chart</p>
            </Link>
          </li>
        </ul>
        {active === "table" && (
          <ul className="nav logo-list">
            <p className="nav-link">Display Option:</p>
            <li>
              <a href="#">
                <img src={`${BASENAME}img/boy.png`} alt="boy" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={`${BASENAME}img/girl.png`} alt="girl" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={`${BASENAME}img/both.png`} alt="both" />
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

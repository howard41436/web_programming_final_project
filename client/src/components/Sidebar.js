/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { BASENAME } from "../constants";

const IconButton = styled.a`
  opacity: ${({ selected }) => (selected ? 1 : 0.7)} !important;

  img {
    margin-right: 5px;
  }
`;

export default function Sidebar(props) {
  const { display = null, setDisplay = null } = props;
  const { pathname } = useLocation();

  const handleSetDisplay = (type) => () => {
    setDisplay((dis) => (dis === type ? null : type));
  };

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
          <li className={pathname === "/" ? "active" : null}>
            <Link to="/">
              <i className="nc-icon nc-money-coins" />
              <p>Our Expenses</p>
            </Link>
          </li>
          <li className={pathname === "/charts" ? "active" : null}>
            <Link to="/charts">
              <i className="nc-icon nc-chart-bar-32" />
              <p>Chart</p>
            </Link>
          </li>
        </ul>
        {pathname === "/" && (
          <ul className="nav logo-list">
            <p className="nav-link">Display Option:</p>
            <li>
              <IconButton
                onClick={handleSetDisplay(0)}
                selected={display === 0}
              >
                <img src={`${BASENAME}img/boy.png`} alt="boy" />
                TOM
              </IconButton>
            </li>
            <li>
              <IconButton
                onClick={handleSetDisplay(1)}
                selected={display === 1}
              >
                <img src={`${BASENAME}img/girl.png`} alt="girl" />
                AMY
              </IconButton>
            </li>
            <li>
              <IconButton
                onClick={handleSetDisplay(-1)}
                selected={display === -1}
              >
                <img src={`${BASENAME}img/both.png`} alt="both" />
                BOTH
              </IconButton>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

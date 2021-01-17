import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";

export default function Sidebar() {
  const { name0, name1 } = useSelector(selectUser);
  const { ownerIcon } = useSelector(selectInfo);
  const { pathname } = useLocation();

  return (
    <div className="sidebar" data-color="white" data-active-color="danger">
      <div className="logo">
        <Link className="simple-text logo-mini" to="/profile">
          <div className="logo-image-small">
            <img src={ownerIcon[0].src} alt={ownerIcon[0].alt} />
          </div>
        </Link>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="simple-text logo-normal">
          {name0} & {name1}
        </a>
      </div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li className={pathname === "/" ? "active" : null}>
            <Link to="/">
              <i className="nc-icon nc-money-coins" />
              <p>Our Expenses</p>
            </Link>
          </li>
          <li className={pathname === "/settles" ? "active" : null}>
            <Link to="/settles">
              <i className="fas fa-hand-holding-usd" />
              <p>Settle Up</p>
            </Link>
          </li>
          <li className={pathname === "/charts" ? "active" : null}>
            <Link to="/charts">
              <i className="nc-icon nc-chart-bar-32" />
              <p>Chart</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

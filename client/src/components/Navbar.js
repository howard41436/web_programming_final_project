/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const { active } = props;

  return (
    <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
      <div className="container-fluid">
        {active === "table" && (
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button type="button" className="navbar-toggler">
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <a className="navbar-brand" href="#">
              Our Expenses
            </a>
            <Link to="/newitems">
              <button
                className="btn btn-outline-success btn-round btn-icon"
                style={{ margin: "1px 1px" }}
                type="button"
              >
                <i className="nc-icon nc-simple-add" />
              </button>
            </Link>
          </div>
        )}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navigation"
          aria-controls="navigation-index"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navigation"
        >
          <form>
            <div className="input-group no-border">
              <input
                type="text"
                value=""
                className="form-control"
                placeholder="Search..."
                onChange={() => {}}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <i className="nc-icon nc-zoom-split" />
                </div>
              </div>
            </div>
          </form>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link btn-rotate" href="#">
                <i className="nc-icon nc-single-02" />
                <p>
                  <span className="d-lg-none d-md-block">Account</span>
                </p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

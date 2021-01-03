import React from "react";
import { Link } from "react-router-dom";
import BaseForm, { BaseFormInput } from "./BaseForm";
import { Button } from "./BaseTags";

export default function Navbar(props) {
  const { title } = props;

  return (
    <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
      <div className="container-fluid">
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <Button
              type="button"
              className="navbar-toggler"
              style={{ position: "relative", zIndex: 99999 }}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </Button>
          </div>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="navbar-brand" style={{ marginRight: "1rem" }}>
            {title}
          </a>
        </div>
        <Button
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
        </Button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navigation"
        >
          <BaseForm formId="navbar_search" initialValues={{ search: "" }}>
            <div className="input-group no-border">
              <BaseFormInput
                className="form-control"
                formId="navbar_search"
                formKey="search"
                placeholder="Search..."
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <i className="nc-icon nc-zoom-split" />
                </div>
              </div>
            </div>
          </BaseForm>
          <ul className="navbar-nav">
            <li className="nav-item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link className="nav-link btn-rotate" to="/profile">
                <i className="nc-icon nc-single-02" />
                <p>
                  <span className="d-lg-none d-md-block">Account</span>
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

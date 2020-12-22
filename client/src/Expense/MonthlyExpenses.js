/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";
import { BASENAME } from "../constants";

const IconFilter = styled.a`
  opacity: ${({ selected }) => (selected ? "1" : "0.4")};
`;

export default function MonthlyExpenses(props) {
  const { categoryInfo, expenses } = props;
  const [display, setDisplay] = useImmer({
    "-1": true,
    0: true,
    1: false,
  });
  const handleSetDisplay = (owner) => () => {
    setDisplay((dis) => {
      dis[owner] = !dis[owner];
    });
  };

  const reverseExp = expenses.map((exp) => exp).reverse();

  const ownerIcon = {
    "-1": {
      src: `${BASENAME}img/both.png`,
      alt: "both",
    },
    0: {
      src: `${BASENAME}img/boy.png`,
      alt: "boy",
    },
    1: {
      src: `${BASENAME}img/girl.png`,
      alt: "girl",
    },
  };

  const shouldBeSettled = (exp) =>
    exp.paid.user0 !== exp.owed.user0 || exp.paid.user1 !== exp.owed.user1;

  const formatDate = (date) => {
    return `${new Date(date).toLocaleString("en", {
      month: "short",
    })}. ${new Date(date).getDate()}`;
  };

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const renderRow = (exp) => {
    return (
      // eslint-disable-next-line dot-notation
      <tr className={shouldBeSettled(exp) ? "selected" : null} key={exp["_id"]}>
        <td className="icon-set">
          <a data-toggle="modal" data-target="#newItem">
            <i className="far fa-edit" />
          </a>{" "}
          <i className="far fa-trash-alt" />
        </td>
        <td>
          <span>{formatDate(exp.date)}</span>
        </td>
        <td style={{ textTransform: "capitalize" }}>
          <span className="icon-big text-center icon-warning">
            <i className={categoryInfo[exp.category].icon} />
          </span>{" "}
          {exp.category}
        </td>
        <td>
          <div className="logo-image-small">
            <img
              src={ownerIcon[String(exp.owner)].src}
              alt={ownerIcon[String(exp.owner)].alt}
            />
          </div>
        </td>
        <td style={{ textTransform: "capitalize" }}>{exp.name}</td>
        <td className="text-right">$ {commaNumber(exp.price)}</td>
      </tr>
    );
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title" style={{ display: "inline" }}>
            Monthly Expenses{" "}
            <a data-toggle="modal" data-target="#newItem">
              <button
                className="btn btn-outline-success btn-round btn-icon"
                type="button"
                style={{ margin: "1px 1px" }}
              >
                <i className="nc-icon nc-simple-add" />
              </button>
            </a>
            <span className="menu">
              <span className="logo-list">
                <IconFilter
                  onClick={handleSetDisplay("0")}
                  selected={display["0"]}
                >
                  <img src={`${BASENAME}img/boy.png`} alt="boy" />
                </IconFilter>{" "}
                <IconFilter
                  onClick={handleSetDisplay("1")}
                  selected={display["1"]}
                >
                  <img src={`${BASENAME}img/girl.png`} alt="girl" />
                </IconFilter>{" "}
                <IconFilter
                  onClick={handleSetDisplay("-1")}
                  selected={display["-1"]}
                >
                  <img src={`${BASENAME}img/both1.png`} alt="both" />
                </IconFilter>
              </span>
              <a
                className="dropdown-toggle"
                id="chooseBudgeType"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ margin: "10px" }}
              >
                <i className="fas fa-list" />
                <span className="d-lg-none d-md-block">Choose Category</span>
              </a>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="chooseBudgeType"
              >
                <a className="dropdown-item">Food</a>
                <a className="dropdown-item">Transportation</a>
                <a className="dropdown-item">Others</a>
              </div>
            </span>
          </h4>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead className="text-primary">
                <tr>
                  <th> </th>
                  <th>
                    Date <i className="fas fa-sort" />
                  </th>
                  <th>Category</th>
                  <th>Member</th>
                  <th>Descriptions</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {reverseExp.map((exp) => display[exp.owner] && renderRow(exp))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { BASENAME } from "../constants";

export default function DailyExpenses(props) {
  const { cardInfo, expenses } = props;

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

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const renderRow = (exp) => {
    return (
      <tr>
        <td style={{ "text-transform": "capitalize" }}>
          <span className="icon-big text-center icon-warning">
            <i className={cardInfo[exp.category].bigIcon} />
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
        <td style={{ "text-transform": "capitalize" }}>{exp.name}</td>
        <td className="text-right">$ {commaNumber(exp.price)}</td>
      </tr>
    );
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Daily Expenses</h4>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead className="text-primary">
                <tr>
                  <th>Category</th>
                  <th>Member</th>
                  <th>Descriptions</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>{expenses.map((exp) => renderRow(exp))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

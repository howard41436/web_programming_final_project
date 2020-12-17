import React from "react";

export default function TableCard(props) {
  const { bigIcon, category, title, smallIcon, stats } = props;

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="card card-stats">
        <div className="card-body">
          <div className="row">
            <div className="col-5 col-md-4">
              <div className="icon-big text-center icon-warning">
                <i className={bigIcon} />
              </div>
            </div>
            <div className="col-7 col-md-8">
              <div className="numbers">
                <p className="card-category">{category}</p>
                <p className="card-title">{`$ ${commaNumber(title)}`}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <hr />
          <div className="stats">
            <i className={smallIcon} />
            {stats}
          </div>
        </div>
      </div>
    </div>
  );
}

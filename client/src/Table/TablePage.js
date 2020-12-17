/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TableCard from "./TableCard";
import DailyExpenses from "./DailyExpenses";

import { SERVER_URL } from "../constants";

export default function TablePage(props) {
  const { pairId } = props;
  const [ready, setReady] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [cardInfo, setCardInfo] = useImmer({
    food: {
      bigIcon: "nc-icon nc-shop text-warning",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "15%",
    },
    transportation: {
      bigIcon: "nc-icon nc-bus-front-12 text-success",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "Last day",
    },
    groceries: {
      bigIcon: "nc-icon nc-cart-simple text-danger",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "In the last hour",
    },
    education: {
      bigIcon: "nc-icon nc-hat-3 text-primary",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "Update now",
    },
  });

  useEffect(() => {
    document.title = "Tables | App's name";
    axios
      .get(`${SERVER_URL}api/allRecords`, { params: { pairId } })
      .then((res) => {
        let total = 0;
        setExpenses(res.data);

        res.data.forEach((exp) => {
          setCardInfo((info) => {
            info[exp.category].title += exp.price;
          });
          total += exp.price;
        });

        Object.keys(cardInfo).forEach((key) => {
          setCardInfo((info) => {
            info[key].stats = `${
              Math.round((info[key].title / total) * 10000) / 100
            }%`;
          });
        });

        setReady(true);
      });
  }, []);

  return (
    <div className="wrapper">
      <Sidebar active="table" />
      <div className="main-panel">
        <Navbar active="table" />
        <div className="content">
          <div className="row">
            {ready &&
              Object.entries(cardInfo).map(([key, value]) => (
                <TableCard
                  key={key}
                  bigIcon={value.bigIcon}
                  category={key}
                  title={value.title}
                  smallIcon={value.smallIcon}
                  stats={` ${value.stats} `}
                />
              ))}
          </div>
          <div className="row">
            <DailyExpenses cardInfo={cardInfo} expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

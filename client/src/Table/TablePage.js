/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TableCard from "./TableCard";
import DailyExpenses from "./DailyExpenses";

import { SERVER_URL } from "../constants";

export default function TablePage() {
  const { pairId } = useSelector(selectUser);
  const [ready, setReady] = useState(false);
  const [display, setDisplay] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [cardInfo, setCardInfo] = useImmer({
    food: {
      bigIcon: "nc-icon nc-shop text-warning",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "0%",
    },
    transportation: {
      bigIcon: "nc-icon nc-bus-front-12 text-success",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "0%",
    },
    groceries: {
      bigIcon: "nc-icon nc-cart-simple text-danger",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "0%",
    },
    education: {
      bigIcon: "nc-icon nc-hat-3 text-primary",
      title: 0,
      smallIcon: "nc-icon nc-chart-pie-36",
      stats: "0%",
    },
  });

  useEffect(() => {
    document.title = "Tables | App's name";
    axios
      .get(`${SERVER_URL}api/allRecords`, { params: { pairId } })
      .then((res) => {
        let total = 0;
        if (res.status === 200) setExpenses(res.data);

        const tmpTitle = {};
        Object.keys(cardInfo).forEach((key) => {
          tmpTitle[key] = 0;
        });

        res.data.forEach((exp) => {
          if (display === exp.owner || display === null) {
            tmpTitle[exp.category] += exp.price;
            total += exp.price;
          }
        });

        Object.keys(cardInfo).forEach((key) => {
          setCardInfo((info) => {
            info[key].title = tmpTitle[key];
            info[key].stats =
              total > 0
                ? `${Math.round((tmpTitle[key] / total) * 10000) / 100}%`
                : "0%";
          });
        });

        setReady(true);
      });
  }, [display]);

  return (
    <div className="wrapper">
      <Sidebar display={display} setDisplay={setDisplay} />
      <div className="main-panel">
        <Navbar />
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
            <DailyExpenses
              cardInfo={cardInfo}
              display={display}
              expenses={expenses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

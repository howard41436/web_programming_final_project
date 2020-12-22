import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

import Sidebar from "../components/Sidebar";
import NewItemCard from "./NewItemCard";
import Navbar from "../components/Navbar";
import ExpenseCard from "./ExpenseCard";
import MonthlyExpenses from "./MonthlyExpenses";

import { INSTANCE } from "../constants";

export default function ExpensePage() {
  const { pairId } = useSelector(selectUser);
  const [display, setDisplay] = useImmer({
    0: true, // Boy
    1: false, // Girl
  });
  const [expenses, setExpenses] = useState([]);
  const [categoryInfo, setCategoryInfo] = useImmer({
    budget: {
      price: 0,
    },
    food: {
      icon: "nc-icon nc-shop text-warning",
      price: 0,
    },
    transportation: {
      icon: "nc-icon nc-bus-front-12 text-success",
      price: 0,
    },
    education: {
      icon: "nc-icon nc-hat-3 text-primary",
      price: 0,
    },
    others: {
      icon: "nc-icon nc-cart-simple text-danger",
      price: 0,
    },
  });

  useEffect(() => {
    document.title = "Our Expenses | App's name";
    INSTANCE.get("/api/allRecords", { params: { pairId } }).then((res) => {
      if (res.status === 200) setExpenses(res.data);
    });
  }, []);

  useEffect(() => {
    setCategoryInfo((info) => {
      Object.values(info).forEach((i) => {
        i.price = 0;
      });

      expenses.forEach((exp) => {
        info[exp.category].price += display["0"] ? exp.owed.user0 : 0;
        info[exp.category].price += display["1"] ? exp.owed.user1 : 0;
      });

      // Temporary
      info.budget.price += display["0"] ? 1000 : 0;
      info.budget.price += display["1"] ? 1000 : 0;
    });
  }, [display, expenses]);

  return (
    <div className="wrapper">
      <Sidebar />
      <NewItemCard />
      <div className="main-panel">
        <Navbar />
        <div className="content">
          <div className="row">
            <ExpenseCard
              categoryInfo={categoryInfo}
              display={display}
              setDisplay={setDisplay}
            />
          </div>
          <div className="row">
            <MonthlyExpenses categoryInfo={categoryInfo} expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

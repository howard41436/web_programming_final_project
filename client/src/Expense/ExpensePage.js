import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

import BasePage from "../components/BasePage";
import FormModal from "./FormModal";
import ExpenseCard from "./ExpenseCard";
import MonthlyExpenses from "./MonthlyExpenses";

import { INSTANCE } from "../constants";

export default function ExpensePage() {
  const { pairId } = useSelector(selectUser);

  const [modalInfo, setModalInfo] = useImmer({
    show: {
      add: false,
      edit: false,
    },
    data: null,
  });

  const categoryInfo = {
    food: {
      index: 1,
      color: "#fbc658",
      icon: "nc-icon nc-shop text-warning",
    },
    transportation: {
      index: 2,
      color: "#6bd098",
      icon: "nc-icon nc-bus-front-12 text-success",
    },
    education: {
      index: 3,
      color: "#51bcda",
      icon: "nc-icon nc-hat-3 text-primary",
    },
    others: {
      index: 4,
      color: "#a3a3a3",
      icon: "nc-icon nc-cart-simple text-danger",
    },
  };

  const [expenses, setExpenses] = useImmer({});

  useEffect(() => {
    document.title = "Our Expenses | App's name";
    INSTANCE.get("/api/allRecords", { params: { pairId } }).then((res) => {
      if (res.status === 200)
        setExpenses(() =>
          // eslint-disable-next-line dot-notation
          res.data.reduce((obj, cur) => ({ ...obj, [cur["_id"]]: cur }), {})
        );
    });
  }, []);

  return (
    <>
      <BasePage>
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <ExpenseCard categoryInfo={categoryInfo} expenses={expenses} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <MonthlyExpenses
                categoryInfo={categoryInfo}
                expenses={expenses}
                setExpenses={setExpenses}
                setModalInfo={setModalInfo}
              />
            </div>
          </div>
        </div>
      </BasePage>
      <FormModal
        categoryList={Object.keys(categoryInfo)}
        info={modalInfo}
        setInfo={setModalInfo}
        setExpenses={setExpenses}
      />
    </>
  );
}

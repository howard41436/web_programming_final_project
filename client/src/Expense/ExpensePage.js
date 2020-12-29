import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import BasePage from "../components/BasePage";
import FormModal from "./FormModal";
import ExpenseCard from "./ExpenseCard";
import MonthlyExpenses from "./MonthlyExpenses";

export default function ExpensePage() {
  const [modalInfo, setModalInfo] = useImmer({
    show: {
      add: false,
      edit: false,
    },
    data: null,
  });

  useEffect(() => {
    document.title = "Our Expenses | App's name";
  }, []);

  return (
    <>
      <BasePage title="Our Expenses">
        <div className="row">
          <div className="col-md-12">
            <ExpenseCard />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <MonthlyExpenses setModalInfo={setModalInfo} />
          </div>
        </div>
      </BasePage>
      <FormModal info={modalInfo} setInfo={setModalInfo} />
    </>
  );
}

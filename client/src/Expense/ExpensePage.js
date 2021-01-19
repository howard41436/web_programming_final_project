import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import BasePage from "../components/BasePage";
import { Row, Col } from "../components/BaseTags";
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
    document.title = "Our Expenses | Together";
  }, []);

  return (
    <>
      <BasePage title="Our Expenses">
        <Row>
          <Col>
            <ExpenseCard />
          </Col>
        </Row>
        <Row>
          <Col>
            <MonthlyExpenses setModalInfo={setModalInfo} />
          </Col>
        </Row>
      </BasePage>
      <FormModal info={modalInfo} setInfo={setModalInfo} />
    </>
  );
}

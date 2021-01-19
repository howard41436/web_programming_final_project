import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import BasePage from "../components/BasePage";
import { Row, Col } from "../components/BaseTags";
import FormModal from "../Expense/FormModal";
import SettleCards from "./SettleCards";
import SettlementRecord from "./SettlementRecord";

export default function SettlePage() {
  useEffect(() => {
    document.title = "Settle Up | Together";
  }, []);

  const [modalInfo, setModalInfo] = useImmer({
    show: {
      edit: false,
    },
    data: null,
  });

  return (
    <>
      <BasePage title="Settle Up">
        <Row>
          <SettleCards />
        </Row>
        <Row>
          <Col>
            <SettlementRecord setModalInfo={setModalInfo} />
          </Col>
        </Row>
      </BasePage>
      <FormModal info={modalInfo} setInfo={setModalInfo} />
    </>
  );
}

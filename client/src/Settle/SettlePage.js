import React, { useEffect } from "react";
import BasePage from "../components/BasePage";
import { Row, Col } from "../components/BaseTags";
import SettleCards from "./SettleCards";
import DebtDetails from "./DebtDetails";

export default function SettlePage() {
  useEffect(() => {
    document.title = "Settle Up | App's name";
  }, []);

  return (
    <BasePage title="Settle Up">
      <Row>
        <SettleCards />
      </Row>
      <Row>
        <Col>
          <DebtDetails />
        </Col>
      </Row>
    </BasePage>
  );
}

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import { selectExpenses } from "../redux/expenseSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, {
  BaseFormGroup,
  BaseFormInput,
  BaseFormTextarea,
} from "../components/BaseForm";
import BaseModal from "../components/BaseModal";
import {
  Row,
  Col,
  Button,
  IconRadioBig,
  IconArrow,
} from "../components/BaseTags";

const CenterCard = styled.div`
  padding-bottom: 15px;
  text-align: center;
`;

export default function SettleCards() {
  const { pairId, boyName, girlName } = useSelector(selectUser);
  const { ownerIcon } = useSelector(selectInfo);
  const { debt } = useSelector(selectExpenses);

  const initialSettlement = {
    pairId,
    payer: 0,
    name: "",
    receivedMoneyOfUser0: 0,
  };

  const validator = (value) => {
    const tmp = parseInt(value, 10);
    const result = Number.isNaN(tmp) || tmp < 0 ? 0 : tmp;
    return result;
  };

  const [show, setShow] = useState(false);
  const handleSetShow = () => {
    setShow((s) => !s);
  };

  const getLastSettlement = (type) => {
    const tmpDebt = debt.recordsAndSettlements.map((d) => d).reverse();
    const minus = type === 0 ? -1 : 1;

    const result = tmpDebt.find(
      (set) =>
        set.type === "settlement" &&
        set.content.receivedMoneyOfUser0 * minus > 0
    );

    return result === undefined
      ? null
      : result.content.receivedMoneyOfUser0 * -1;
  };

  const [lastSettlement] = useImmer({
    0: getLastSettlement(0),
    1: getLastSettlement(1),
  });

  const renderSideCard = (type) => (
    <Row style={{ paddingBottom: "15px" }}>
      <Col size={5} otherSize={{ default: 7 }}>
        <div className="text-center">
          <a>
            <img
              src={ownerIcon[String(type)].src}
              alt={ownerIcon[String(type)].alt}
            />
          </a>
        </div>
      </Col>
      <Col size={6} otherSize={{ default: 5 }}>
        <div className="numbers">
          <p className="card-category">Last Settlement</p>
          <p className="card-title">
            {lastSettlement[type] ? `$ ${lastSettlement[type]}` : "No Record"}
          </p>
        </div>
      </Col>
    </Row>
  );

  return (
    <>
      <Col size={4}>
        <BaseCard className="card-stats">{renderSideCard(1)}</BaseCard>
      </Col>
      <Col size={4}>
        <BaseCard className="card-stats">
          <CenterCard>
            {debt.debtOfUser0 >= 0 ? boyName : girlName} owes{" "}
            {debt.debtOfUser0 >= 0 ? girlName : boyName}{" "}
            <strong style={{ fontSize: "16px" }}>$ {debt.debtOfUser0}</strong>
            <br />
            <Button theme="primary" type="button" onClick={handleSetShow}>
              Settle with amount
            </Button>
          </CenterCard>
        </BaseCard>
      </Col>
      <Col size={4}>
        <BaseCard className="card-stats">{renderSideCard(0)}</BaseCard>
      </Col>

      <BaseModal
        show={show}
        setShow={setShow}
        modalId="settle_with_amount_modal"
        title="Settle with amount"
      >
        <BaseForm
          formId="settle_with_amount_form"
          initialValues={initialSettlement}
          allowSubmit
          submitText="Add"
        >
          <Row>
            <Col size={4} className="pr-1">
              <div className="logo logo-form">
                <a className="simple-text logo-mini">
                  <BaseFormInput
                    id="settle_radio_girl"
                    formId="settle_with_amount_form"
                    formKey="payer"
                    type="radio"
                    name="payer"
                    inputValue={1}
                    CustomInput={IconRadioBig}
                  />
                  <label htmlFor="settle_radio_girl">
                    <img
                      src={`${ownerIcon["1"].src}`}
                      alt={`${ownerIcon["1"].alt}`}
                      style={{ marginTop: "12px", marginBottom: "18px" }}
                    />
                  </label>
                </a>
              </div>
            </Col>
            <Col size={4} className="px-1">
              <h1 className="settle-arrow">
                <a className="simple-text">
                  <BaseFormInput
                    id="settle_radio_right"
                    formId="settle_with_amount_form"
                    formKey="payer"
                    type="radio"
                    name="payer"
                    inputValue={1}
                    CustomInput={IconArrow}
                  />
                  <label htmlFor="settle_radio_right">
                    <i className="fas fa-long-arrow-alt-right" />
                  </label>
                </a>
                <br />
                <a className="simple-text">
                  <BaseFormInput
                    id="settle_radio_left"
                    formId="settle_with_amount_form"
                    formKey="payer"
                    type="radio"
                    name="payer"
                    inputValue={-1}
                    CustomInput={IconArrow}
                  />
                  <label htmlFor="settle_radio_left">
                    <i className="fas fa-long-arrow-alt-left" />
                  </label>
                </a>
              </h1>
            </Col>
            <Col size={4} className="pl-1">
              <div className="logo logo-form">
                <a className="simple-text logo-mini">
                  <BaseFormInput
                    id="settle_radio_boy"
                    formId="settle_with_amount_form"
                    formKey="payer"
                    type="radio"
                    name="payer"
                    inputValue={-1}
                    CustomInput={IconRadioBig}
                  />
                  <label htmlFor="settle_radio_boy">
                    <img
                      src={`${ownerIcon["0"].src}`}
                      alt={`${ownerIcon["0"].alt}`}
                      style={{ marginTop: "12px", marginBottom: "18px" }}
                    />
                  </label>
                </a>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <BaseFormGroup label="Amount">
                <BaseFormInput
                  formId="settle_with_amount_form"
                  formKey="receivedMoneyOfUser0"
                  validator={validator}
                />
              </BaseFormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <BaseFormGroup label="Description">
                <BaseFormTextarea
                  formId="settle_with_amount_form"
                  formKey="name"
                />
              </BaseFormGroup>
            </Col>
          </Row>
        </BaseForm>
      </BaseModal>
    </>
  );
}

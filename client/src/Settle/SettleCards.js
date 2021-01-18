/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import { setDebt, selectExpenses } from "../redux/expenseSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import BaseModal from "../components/BaseModal";
import {
  Row,
  Col,
  Button,
  IconRadioBig,
  IconArrow,
} from "../components/BaseTags";
import { INSTANCE } from "../constants";

const Footer = styled.div.attrs({
  className: "card-footer",
})`
  text-align: center;
`;

export default function SettleCards() {
  const dispatch = useDispatch();
  const { pairId, name, name1 } = useSelector(selectUser);
  const { ownerIcon } = useSelector(selectInfo);
  const { debt } = useSelector(selectExpenses);

  const initialSettlement = {
    pairId,
    payer: -Math.sign(debt.debtOfUser0),
    receivedMoneyOfUser0: Math.abs(debt.debtOfUser0),
  };

  const validator = (value) => {
    const tmp = parseInt(value, 10);
    const result = Number.isNaN(tmp) || tmp < 1 ? 1 : tmp;
    return result;
  };

  const [show, setShow] = useState(false);
  const handleSetShow = () => {
    setShow((s) => !s);
  };

  const CardHeader = () => (
    <div style={{ textAlign: "center" }}>
      <Row>
        <Col size={4}>
          <h5 className="card-title settle-arrow">{name}</h5>
        </Col>
        <Col size={4}>
          <h5 className="card-title">Summary</h5>
        </Col>
        <Col size={4}>
          <h5 className="card-title settle-arrow">{name1}</h5>
        </Col>
      </Row>
    </div>
  );

  const handleSettle = (formValues) => {
    const { payer } = formValues;
    const receivedMoneyOfUser0 = payer * formValues.receivedMoneyOfUser0;
    INSTANCE.post("/api/newSettlement", {
      pairId,
      receivedMoneyOfUser0,
      date: new Date().toISOString(),
    })
      .then((res) => {
        dispatch(
          setDebt({
            debt: {
              debtOfUser0: debt.debtOfUser0 + res.data.receivedMoneyOfUser0,
              recordsAndSettlements: {
                ...debt.recordsAndSettlements,
                // eslint-disable-next-line dot-notation
                [res.data["_id"]]: { type: "settlement", content: res.data },
              },
            },
          })
        );
      })
      .finally(() => setShow(false));
  };

  return (
    <>
      <Col>
        <BaseCard
          className="card-stats"
          allowHeader
          titleSize={0}
          otherHeader={<CardHeader />}
        >
          <Row>
            <Col size={4}>
              <div className="text-center">
                <a>
                  <img
                    src={ownerIcon["0"].src}
                    alt={ownerIcon["0"].alt}
                    style={{ width: "50%" }}
                  />
                </a>
              </div>
            </Col>
            <Col size={4} style={{ textAlign: "center", paddingTop: "20px" }}>
              <h2
                className={`settle-arrow ${
                  initialSettlement.payer === -1 ? "girl" : "boy"
                }`}
                style={{ margin: 0 }}
              >
                $ {Math.abs(debt.debtOfUser0)}
              </h2>
              <h1 className="settle-arrow" style={{ margin: 0 }}>
                <i
                  className={`fas fa-long-arrow-alt-${
                    initialSettlement.payer === -1 ? "right girl" : "left boy"
                  } fa-3x`}
                  style={{
                    display: debt.debtOfUser0 === 0 ? "none" : null,
                    lineHeight: "30%",
                    transform: "scale(2,1)",
                  }}
                />
              </h1>
              <Button
                disabled={debt.debtOfUser0 === 0}
                theme="primary"
                type="button"
                onClick={handleSetShow}
              >
                Settle with amount
              </Button>
            </Col>
            <Col size={4}>
              <div className="text-center">
                <a>
                  <img
                    src={ownerIcon["1"].src}
                    alt={ownerIcon["1"].alt}
                    style={{ width: "50%" }}
                  />
                </a>
              </div>
            </Col>
          </Row>
          <Footer />
        </BaseCard>
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
          submitText="Settle"
          onSubmit={handleSettle}
        >
          <Row>
            <Col size={4} className="pr-1">
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
                  <label
                    htmlFor="settle_radio_boy"
                    style={{
                      pointerEvents:
                        initialSettlement.payer === -1 ? null : "none",
                    }}
                  >
                    <img
                      src={`${ownerIcon["0"].src}`}
                      alt={`${ownerIcon["0"].alt}`}
                      style={{ marginTop: "14px", marginBottom: "21px" }}
                    />
                  </label>
                </a>
              </div>
            </Col>
            <Col size={4} className="px-1">
              <h1 className="settle-arrow">
                <br />
                {initialSettlement.payer === -1 && (
                  <a className="simple-text">
                    <BaseFormInput
                      id="settle_radio_right"
                      formId="settle_with_amount_form"
                      formKey="payer"
                      type="radio"
                      name="payer"
                      inputValue={-1}
                      CustomInput={IconArrow}
                    />
                    <label htmlFor="settle_radio_right">
                      <i className="fas fa-long-arrow-alt-right" />
                    </label>
                  </a>
                )}
                {initialSettlement.payer === 1 && (
                  <a className="simple-text">
                    <BaseFormInput
                      id="settle_radio_left"
                      formId="settle_with_amount_form"
                      formKey="payer"
                      type="radio"
                      name="payer"
                      inputValue={1}
                      CustomInput={IconArrow}
                    />
                    <label htmlFor="settle_radio_left">
                      <i className="fas fa-long-arrow-alt-left" />
                    </label>
                  </a>
                )}
              </h1>
            </Col>
            <Col size={4} className="pl-1">
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
                  <label
                    htmlFor="settle_radio_girl"
                    style={{
                      pointerEvents:
                        initialSettlement.payer === 1 ? null : "none",
                    }}
                  >
                    <img
                      src={`${ownerIcon["1"].src}`}
                      alt={`${ownerIcon["1"].alt}`}
                      style={{ marginTop: "14px", marginBottom: "21px" }}
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
        </BaseForm>
      </BaseModal>
    </>
  );
}

/* eslint-disable dot-notation */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import { setDebt, setExpenses, selectExpenses } from "../redux/expenseSlice";

import BaseModal from "../components/BaseModal";
import BaseForm, {
  BaseFormGroup,
  BaseFormInput,
  BaseFormTextarea,
  BaseFormSelect,
  BaseFormOption,
  baseFormReset,
} from "../components/BaseForm";
import { baseToast, BaseToastInner } from "../components/BaseToast";
import { Row, Col, IconRadio } from "../components/BaseTags";
import { INSTANCE } from "../constants";

export default function FormModal(props) {
  const dispatch = useDispatch();
  const { categoryInfo, ownerIcon } = useSelector(selectInfo);
  const categoryList = Object.keys(categoryInfo);
  const { expenses, debt } = useSelector(selectExpenses);
  const { pairId } = useSelector(selectUser);

  const { info, setInfo } = props;
  const handleSetShow = (type) => (show) => {
    setInfo((inf) => {
      inf.show[type] = show;
    });
  };

  const initialExpenses = {
    pairId,
    category: "",
    owner: -2,
    price: 0,
    name: "",
    date: "",
    paid: { user0: 0, user1: 0 },
    owed: { user0: 0, user1: 0 },
  };

  const validator = (value) => {
    const tmp = parseInt(value, 10);
    const result = Number.isNaN(tmp) || tmp < 0 ? 0 : tmp;
    return result;
  };

  const updater = (formKey, all) => {
    if (Array.isArray(formKey)) {
      // formKey: owed / paid
      if (formKey[1] === "user0") {
        all[formKey[0]].user0 = Math.min(all.price, all[formKey[0]].user0);
        all[formKey[0]].user1 = all.price - all[formKey[0]].user0;
      } else {
        all[formKey[0]].user1 = Math.min(all.price, all[formKey[0]].user1);
        all[formKey[0]].user0 = all.price - all[formKey[0]].user1;
      }

      // formKey: owner
    } else if (all.owner === 0) {
      all.owed.user0 = all.price;
      all.owed.user1 = 0;
    } else if (all.owner === 1) {
      all.owed.user0 = 0;
      all.owed.user1 = all.price;
    }
    return all;
  };

  const allUpdater = [
    { depend: "owner", update: updater },
    { depend: "price", update: updater },
    { depend: ["paid", "user0"], update: updater },
    { depend: ["paid", "user1"], update: updater },
    { depend: ["owed", "user0"], update: updater },
    { depend: ["owed", "user1"], update: updater },
  ];

  useEffect(() => {
    if (info.data) baseFormReset(dispatch, "edit_expenses_form", info.data);
    else baseFormReset(dispatch, "add_expenses_form", initialExpenses);
  }, [info.data]);

  const formatDate = (date) => {
    return `${new Date(date).toLocaleString("en", {
      month: "short",
    })}. ${new Date(date).getDate()}`;
  };

  const handleSubmit = (type) => (formValues) => {
    if (type === "add") {
      INSTANCE.post(
        "/api/newRecord",
        {
          ...formValues,
          date: new Date().toISOString(),
        },
        { params: { pairId } }
      )
        .then((res) => {
          if (res.status === 200) {
            setInfo((s) => {
              s.show[type] = false; // Close Modal
            });
            dispatch(
              setExpenses({
                expenses: { ...expenses, [res.data["_id"]]: res.data },
              })
            );
            dispatch(
              setDebt({
                debt: {
                  debtOfUser0:
                    debt.debtOfUser0 +
                    (res.data.owed.user0 - res.data.paid.user0),
                  recordsAndSettlements: {
                    ...debt.recordsAndSettlements,
                    // eslint-disable-next-line dot-notation
                    [res.data["_id"]]: {
                      type: "record",
                      content: res.data,
                    },
                  },
                },
              })
            );
          }
          return res.data;
        })
        .then((data) => {
          baseToast(
            <BaseToastInner
              icon="nc-icon nc-check-2"
              title="Add successfully."
              message={`(${data.name}, $ ${data.price}, ${formatDate(
                data.date
              )})`}
            />,
            {
              position: "top-center",
              autoClose: 6000,
            }
          );
        });
    }
    if (type === "edit") {
      INSTANCE.post("/api/editRecord", formValues, {
        params: {
          _id: formValues["_id"],
          pairId,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            const originDebtUser0 =
              expenses[res.data["_id"]].owed.user0 -
              expenses[res.data["_id"]].paid.user0;

            setInfo((s) => {
              s.show[type] = false; // Close Modal
            });
            dispatch(
              setExpenses({
                expenses: { ...expenses, [res.data["_id"]]: res.data },
              })
            );
            dispatch(
              setDebt({
                debt: {
                  debtOfUser0:
                    debt.debtOfUser0 -
                    originDebtUser0 +
                    (res.data.owed.user0 - res.data.paid.user0),
                  recordsAndSettlements: {
                    ...debt.recordsAndSettlements,
                    // eslint-disable-next-line dot-notation
                    [res.data["_id"]]: {
                      type: "record",
                      content: res.data,
                    },
                  },
                },
              })
            );
          }
          return res.data;
        })
        .then((data) => {
          baseToast(
            <BaseToastInner
              icon="nc-icon nc-check-2"
              title="Edit successfully."
              message={`(${data.name}, $ ${data.price}, ${formatDate(
                data.date
              )})`}
            />,
            {
              position: "top-center",
              autoClose: 6000,
            }
          );
        });
    }
  };

  const owedHidden = (_, all, getOthers) => {
    return String(getOthers("owner", all)) !== "-1";
  };

  const renderForm = (type, formId) => (
    <>
      <Row>
        <Col>
          <BaseFormGroup formId={formId} label="Category">
            <BaseFormSelect
              formId={formId}
              formKey="category"
              placeholder="Select a Category"
            >
              {categoryList.map((cat) => (
                <BaseFormOption
                  key={cat}
                  formId={formId}
                  formKey="category"
                  value={cat}
                  hidden={(v) => v === cat}
                >
                  <i className={categoryInfo[cat].icon} /> {cat}
                </BaseFormOption>
              ))}
            </BaseFormSelect>
          </BaseFormGroup>
        </Col>
        <Col>
          <BaseFormGroup formId={formId} label="Amount">
            <BaseFormInput
              formId={formId}
              formKey="price"
              type="number"
              validator={validator}
            />
          </BaseFormGroup>
        </Col>
      </Row>
      <Row style={{ padding: "5px 0" }}>
        <Col>
          <BaseFormGroup formId={formId} label="Member">
            <span className="logo-list select-logo">
              {" "}
              <BaseFormInput
                id={`${type}_radio_boy`}
                formId={formId}
                formKey="owner"
                type="radio"
                name="owner"
                inputValue={0}
                CustomInput={IconRadio}
              />
              <label htmlFor={`${type}_radio_boy`}>
                <img src={ownerIcon["0"].src} alt={ownerIcon["0"].alt} />
              </label>{" "}
              <BaseFormInput
                id={`${type}_radio_girl`}
                formId={formId}
                formKey="owner"
                type="radio"
                name="owner"
                inputValue={1}
                CustomInput={IconRadio}
              />
              <label htmlFor={`${type}_radio_girl`}>
                <img src={ownerIcon["1"].src} alt={ownerIcon["1"].alt} />
              </label>{" "}
              <BaseFormInput
                id={`${type}_radio_both`}
                formId={formId}
                formKey="owner"
                type="radio"
                name="owner"
                inputValue={-1}
                CustomInput={IconRadio}
              />
              <label htmlFor={`${type}_radio_both`}>
                <img src={ownerIcon["-1"].src} alt={ownerIcon["-1"].src} />
              </label>
            </span>
          </BaseFormGroup>
        </Col>
      </Row>
      <Row>
        <Col size={6} className="pr-1">
          <BaseFormGroup formId={formId} label="Tom | Paid">
            <BaseFormInput
              formId={formId}
              formKey={["paid", "user0"]}
              type="number"
              validator={validator}
            />
          </BaseFormGroup>
        </Col>
        <Col size={6} className="pl-1">
          <BaseFormGroup formId={formId} label="Amy | Paid">
            <BaseFormInput
              formId={formId}
              formKey={["paid", "user1"]}
              type="number"
              validator={validator}
            />
          </BaseFormGroup>
        </Col>
      </Row>
      <Row>
        <Col size={6} className="pr-1">
          <BaseFormGroup formId={formId} label="Tom | Owed" hidden={owedHidden}>
            <BaseFormInput
              formId={formId}
              formKey={["owed", "user0"]}
              type="number"
              validator={validator}
            />
          </BaseFormGroup>
        </Col>
        <Col size={6} className="pl-1">
          <BaseFormGroup formId={formId} label="Amy | Owed" hidden={owedHidden}>
            <BaseFormInput
              formId={formId}
              formKey={["owed", "user1"]}
              type="number"
              validator={validator}
            />
          </BaseFormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <BaseFormGroup label="Description">
            <BaseFormTextarea formId={formId} formKey="name" />
          </BaseFormGroup>
        </Col>
      </Row>
    </>
  );

  return (
    <>
      <BaseModal
        show={info.show.add}
        setShow={handleSetShow("add")}
        modalId="add_modal"
        title="Add Expenses"
      >
        <BaseForm
          formId="add_expenses_form"
          initialValues={initialExpenses}
          updater={allUpdater}
          allowSubmit
          submitText="Add"
          onSubmit={handleSubmit("add")}
        >
          {renderForm("add", "add_expenses_form")}
        </BaseForm>
      </BaseModal>
      <BaseModal
        show={info.show.edit}
        setShow={handleSetShow("edit")}
        modalId="edit_modal"
        title="Edit Expenses"
      >
        <BaseForm
          formId="edit_expenses_form"
          initialValues={initialExpenses}
          updater={allUpdater}
          allowSubmit
          submitText="Edit"
          onSubmit={handleSubmit("edit")}
        >
          {renderForm("edit", "edit_expenses_form")}
        </BaseForm>
      </BaseModal>
    </>
  );
}

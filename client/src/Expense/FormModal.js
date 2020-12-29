/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import { setExpenses, selectExpenses } from "../redux/expenseSlice";

import BaseModal from "../components/BaseModal";
import { IconRadio } from "../components/IconTags";
import { BASENAME, INSTANCE } from "../constants";

export default function FormModal(props) {
  const dispatch = useDispatch();
  const { categoryInfo } = useSelector(selectInfo);
  const categoryList = Object.keys(categoryInfo);
  const { expenses } = useSelector(selectExpenses);
  const { pairId } = useSelector(selectUser);

  const { info, setInfo } = props;
  const handleSetShow = (type) => (show) => {
    setInfo((inf) => {
      inf.show[type] = show;
    });
  };

  const initExpenses = {
    pairId,
    category: "food",
    owner: -2,
    price: 0,
    name: "",
    date: "",
    paid: { user0: 0, user1: 0 },
    owed: { user0: 0, user1: 0 },
  };
  const [newExpenses, setNewExpenses] = useImmer(initExpenses);

  const handleSetNewExpenses = (key1, key2 = null) => (event) => {
    if (key2) {
      setNewExpenses((exp) => {
        const tmp = parseInt(event.target.value, 10);
        exp[key1][key2] =
          Number.isNaN(tmp) || tmp < 0 ? 0 : tmp > exp.price ? exp.price : tmp;

        if (key2 === "user0") exp[key1].user1 = exp.price - exp[key1].user0;
        else exp[key1].user0 = exp.price - exp[key1].user1;
      });
    } else {
      setNewExpenses((exp) => {
        if (typeof exp[key1] === "number") {
          const tmp = parseInt(event.target.value, 10);
          exp[key1] =
            Number.isNaN(tmp) || (tmp < 0 && key1 !== "owner") ? 0 : tmp;

          const owner = key1 === "owner" ? tmp : exp.owner;
          const price = key1 === "price" ? tmp : exp.price;
          if (owner === 0) {
            exp.owed.user0 = price;
            exp.owed.user1 = 0;
          } else if (owner === 1) {
            exp.owed.user0 = 0;
            exp.owed.user1 = price;
          }
        } else exp[key1] = event.target.value;
      });
    }
  };

  useEffect(() => {
    if (info.data) {
      setNewExpenses(() => info.data);
    } else {
      setNewExpenses(() => initExpenses);
    }
  }, [info.data]);

  const handleSubmit = (type) => () => {
    const flag = !(
      newExpenses.owner === -2 ||
      newExpenses.price === 0 ||
      newExpenses.name === ""
    );

    if (flag) {
      if (type === "add") {
        INSTANCE.post("/api/newRecord", {
          ...newExpenses,
          date: new Date().toISOString(),
        }).then((res) => {
          if (res.status === 200) {
            setInfo((s) => {
              s.show[type] = false;
            });
            dispatch(
              setExpenses({
                // eslint-disable-next-line dot-notation
                expenses: { ...expenses, [res.data["_id"]]: res.data },
              })
            );
          }
        });
      }
      if (type === "edit") {
        INSTANCE.post(
          "/api/editRecord",
          {
            ...newExpenses,
          },
          {
            params: {
              // eslint-disable-next-line dot-notation
              _id: newExpenses["_id"],
            },
          }
        ).then((res) => {
          if (res.status === 200) {
            setInfo((s) => {
              s.show[type] = false;
            });
            dispatch(
              setExpenses({
                // eslint-disable-next-line dot-notation
                expenses: { ...expenses, [res.data["_id"]]: res.data },
              })
            );
          }
        });
      }
    }
  };

  const renderForm = (type) => (
    <form>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={newExpenses.category}
              onChange={handleSetNewExpenses("category")}
              style={{ textTransform: "capitalize" }}
            >
              {categoryList.map((cat) => (
                <option
                  key={cat}
                  style={{ textTransform: "capitalize" }}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              className="form-control"
              onChange={handleSetNewExpenses("price")}
              value={String(newExpenses.price)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label>Member</label>
            <span className="logo-list">
              {" "}
              <IconRadio
                id={`${type}_radio_boy`}
                checked={newExpenses.owner === 0}
                onChange={handleSetNewExpenses("owner")}
                name="owner"
                value={0}
              />
              <label htmlFor={`${type}_radio_boy`}>
                <img src={`${BASENAME}img/boy.png`} alt="boy" />
              </label>{" "}
              <IconRadio
                id={`${type}_radio_girl`}
                checked={newExpenses.owner === 1}
                onChange={handleSetNewExpenses("owner")}
                name="owner"
                value={1}
              />
              <label htmlFor={`${type}_radio_girl`}>
                <img src={`${BASENAME}img/girl.png`} alt="girl" />
              </label>{" "}
              <IconRadio
                id={`${type}_radio_both`}
                checked={newExpenses.owner === -1}
                onChange={handleSetNewExpenses("owner")}
                name="owner"
                value={-1}
              />
              <label htmlFor={`${type}_radio_both`}>
                <img src={`${BASENAME}img/both.png`} alt="both" />
              </label>
            </span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 pr-1">
          <div className="form-group">
            <label>Tom | Paid</label>
            <input
              type="number"
              className="form-control"
              onChange={handleSetNewExpenses("paid", "user0")}
              value={String(newExpenses.paid.user0)}
            />
          </div>
        </div>
        <div className="col-md-6 pl-1">
          <div className="form-group">
            <label>Amy | Paid</label>
            <input
              type="number"
              className="form-control"
              onChange={handleSetNewExpenses("paid", "user1")}
              value={String(newExpenses.paid.user1)}
            />
          </div>
        </div>
      </div>
      {newExpenses.owner === -1 && (
        <div className="row">
          <div className="col-md-6 pr-1">
            <div className="form-group">
              <label>Tom | Owed</label>
              <input
                type="number"
                className="form-control"
                placeholder="Tom"
                onChange={handleSetNewExpenses("owed", "user0")}
                value={String(newExpenses.owed.user0)}
              />
            </div>
          </div>
          <div className="col-md-6 pl-1">
            <div className="form-group">
              <label>Amy | Owed</label>
              <input
                type="number"
                className="form-control"
                placeholder="Amy"
                onChange={handleSetNewExpenses("owed", "user1")}
                value={String(newExpenses.owed.user1)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              onChange={handleSetNewExpenses("name")}
              value={newExpenses.name}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="update ml-auto mr-auto">
          <button
            type="button"
            className="btn btn-primary btn-round"
            onClick={handleSubmit(type)}
          >
            {type}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <BaseModal
        show={info.show.add}
        setShow={handleSetShow("add")}
        modalId="add_modal"
        title="Add Expenses"
      >
        {renderForm("add")}
      </BaseModal>
      <BaseModal
        show={info.show.edit}
        setShow={handleSetShow("edit")}
        modalId="edit_modal"
        title="Edit Expenses"
      >
        {renderForm("edit")}
      </BaseModal>
    </>
  );
}

/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import BaseModal from "../components/BaseModal";
import { IconRadio } from "../components/IconTags";
import { BASENAME, INSTANCE } from "../constants";

export default function FormModal(props) {
  const { pairId } = useSelector(selectUser);

  const { info, setInfo } = props;
  const handleSetShow = (type) => (s) => {
    setInfo((ss) => {
      ss.show[type] = s;
    });
  };

  const categoryList = ["food", "transportation", "education", "others"];

  const initExpense = {
    pairId,
    category: "food",
    owner: -2,
    price: 0,
    name: "",
    date: "",
    paid: { user0: 0, user1: 0 },
    owed: { user0: 0, user1: 0 },
  };
  const [newExpense, setNewExpense] = useImmer(initExpense);

  const handleSetNewExpense = (key1, key2 = null) => (event) => {
    if (key2) {
      setNewExpense((exp) => {
        const tmp = parseInt(event.target.value, 10);
        exp[key1][key2] =
          Number.isNaN(tmp) || tmp < 0 ? 0 : tmp > exp.price ? exp.price : tmp;

        if (key2 === "user0") exp[key1].user1 = exp.price - exp[key1].user0;
        else exp[key1].user0 = exp.price - exp[key1].user1;
      });
    } else {
      setNewExpense((exp) => {
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
      setNewExpense(() => info.data);
    } else {
      setNewExpense(() => initExpense);
    }
  }, [info.data]);

  const handleSubmit = (type) => () => {
    const flag = !(
      newExpense.owner === -2 ||
      newExpense.price === 0 ||
      newExpense.name === ""
    );

    if (flag) {
      if (type === "add") {
        INSTANCE.post("/api/newRecord", {
          ...newExpense,
          date: new Date().toISOString(),
        }).then((res) => {
          if (res.status === 200)
            setInfo((s) => {
              s.show[type] = false;
            });
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
              value={newExpense.category}
              onChange={handleSetNewExpense("category")}
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
              onChange={handleSetNewExpense("price")}
              value={String(newExpense.price)}
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
                checked={newExpense.owner === 0}
                onChange={handleSetNewExpense("owner")}
                name="owner"
                value={0}
              />
              <label htmlFor={`${type}_radio_boy}`}>
                <img src={`${BASENAME}img/boy.png`} alt="boy" />
              </label>{" "}
              <IconRadio
                id={`${type}_radio_girl}`}
                checked={newExpense.owner === 1}
                onChange={handleSetNewExpense("owner")}
                name="owner"
                value={1}
              />
              <label htmlFor={`${type}_radio_girl}`}>
                <img src={`${BASENAME}img/girl.png`} alt="girl" />
              </label>{" "}
              <IconRadio
                id={`${type}_radio_both}`}
                checked={newExpense.owner === -1}
                onChange={handleSetNewExpense("owner")}
                name="owner"
                value={-1}
              />
              <label htmlFor={`${type}_radio_both}`}>
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
              onChange={handleSetNewExpense("paid", "user0")}
              value={String(newExpense.paid.user0)}
            />
          </div>
        </div>
        <div className="col-md-6 pl-1">
          <div className="form-group">
            <label>Amy | Paid</label>
            <input
              type="number"
              className="form-control"
              onChange={handleSetNewExpense("paid", "user1")}
              value={String(newExpense.paid.user1)}
            />
          </div>
        </div>
      </div>
      {newExpense.owner === -1 && (
        <div className="row">
          <div className="col-md-6 pr-1">
            <div className="form-group">
              <label>Tom | Owed</label>
              <input
                type="number"
                className="form-control"
                placeholder="Tom"
                onChange={handleSetNewExpense("owed", "user0")}
                value={String(newExpense.owed.user0)}
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
                onChange={handleSetNewExpense("owed", "user1")}
                value={String(newExpense.owed.user1)}
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
              onChange={handleSetNewExpense("name")}
              value={newExpense.name}
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

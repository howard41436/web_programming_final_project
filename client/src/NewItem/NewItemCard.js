/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { BASENAME, SERVER_URL } from "../constants";

const IconRadio = styled.input.attrs(() => ({
  type: "radio",
  name: "owner",
}))`
  display: none;

  & + label {
    cursor: pointer;
    display: contents;
  }

  & + label img {
    background: ${({ checked }) =>
      checked ? "rgba(81, 203, 206, 0.6)" : "transparent"};
    border-radius: 5px;
    padding: ${({ checked }) => (checked ? "3px" : 0)};
  }

  &:hover + label img {
    background: ${({ checked }) =>
      checked ? "rgba(81, 203, 206, 0.6)" : "rgba(81, 203, 206, 0.2)"};
    padding: 5px;
  }
`;

export default function NewItemCard() {
  const { pairId } = useSelector(selectUser);
  const categoryList = ["food", "transportation", "groceries", "education"];

  const history = useHistory();
  const [newExpense, setNewExpense] = useImmer({
    pairId,
    category: "food",
    owner: -2,
    price: 0,
    name: "",
    date: "",
    paid: { user0: 0, user1: 0 },
    owed: { user0: 0, user1: 0 },
  });

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

  const handleSubmit = () => {
    const flag = !(
      newExpense.owner === -2 ||
      newExpense.price === 0 ||
      newExpense.name === ""
    );

    if (flag) {
      axios
        .post(`${SERVER_URL}api/newRecord`, {
          ...newExpense,
          date: new Date().toISOString(),
        })
        .then((res) => {
          if (res.status === 200) history.push("/");
        });
    }
  };

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header">
              <h5 className="card-title">Add Expenses</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        className="form-control"
                        defaultValue="food"
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
                        <IconRadio
                          id="radio_boy"
                          checked={newExpense.owner === 0}
                          onChange={handleSetNewExpense("owner")}
                          value={0}
                        />
                        <label htmlFor="radio_boy">
                          <img src={`${BASENAME}img/boy.png`} alt="boy" />
                        </label>
                        <IconRadio
                          id="radio_girl"
                          checked={newExpense.owner === 1}
                          onChange={handleSetNewExpense("owner")}
                          value={1}
                        />
                        <label htmlFor="radio_girl">
                          <img src={`${BASENAME}img/girl.png`} alt="girl" />
                        </label>
                        <IconRadio
                          id="radio_both"
                          checked={newExpense.owner === -1}
                          onChange={handleSetNewExpense("owner")}
                          value={-1}
                        />
                        <label htmlFor="radio_both">
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
                      onClick={handleSubmit}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

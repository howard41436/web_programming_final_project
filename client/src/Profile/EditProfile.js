/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { errorToast, successToast } from "../components/BaseToast";
import { Row, Col, IconRadio } from "../components/BaseTags";
import { INSTANCE, AVATAR } from "../constants";

const PercentInput = styled.input`
  border-radius: 0;
  color: black;
  margin-top: 5px;
  padding: 0 !important;
  width: ${({ maxLength, value }) =>
    maxLength ? (value < 10 ? 1.5 : value >= 100 ? 4.5 : 3) : null}ch;

  :focus {
    border: none;
    box-shadow: none;
    color: gray;
  }
`;

export default function EditProfile() {
  const dispatch = useDispatch();
  const {
    pairId,
    user0,
    user1,
    username,
    user,
    budget,
    defaultExpenseAllocation,
    anniversary,
  } = useSelector(selectUser);
  const { categoryInfo, ownerIcon } = useSelector(selectInfo);

  // YYYY-MM-DD
  const formatDate = (date) => {
    return `${new Date(date).toISOString().split("T")[0]}`;
  };

  const initialProfile = {
    user0,
    user1,
    username,
    budget,
    defaultExpenseAllocation,
    anniversary: formatDate(anniversary),
  };

  const validator = (value) => {
    const tmp = parseInt(value, 10);
    const result = Number.isNaN(tmp) || tmp < 0 ? 0 : tmp;
    return result;
  };

  const budgetUpdater = (formKey, all) => {
    const tmpBudget = all.budget[formKey[1]];
    const sumBudget = Object.keys(categoryInfo).reduce(
      (sum, cur) => sum + (tmpBudget[cur] || 0),
      0
    );
    all.budget[formKey[1]].total = Math.max(
      all.budget[formKey[1]].total,
      sumBudget
    );
    return all;
  };

  const allocateUpdater = (formKey, all, value) => {
    if (typeof value !== "number") return all;
    if (formKey[3] === "user0") {
      all.defaultExpenseAllocation.details.percentage.user1 = 100 - value;
    } else {
      all.defaultExpenseAllocation.details.percentage.user0 = 100 - value;
    }
    return all;
  };

  const allUpdater = [
    {
      depend: ["budget", user === "0" ? "user0" : "user1", "total"],
      update: budgetUpdater,
    },
    ...Object.keys(categoryInfo).map((cat) => ({
      depend: ["budget", user === "0" ? "user0" : "user1", cat],
      update: budgetUpdater,
    })),
    {
      depend: ["defaultExpenseAllocation", "details", "percentage", "user0"],
      update: allocateUpdater,
    },
    {
      depend: ["defaultExpenseAllocation", "details", "percentage", "user1"],
      update: allocateUpdater,
    },
  ];

  const handleEditProfile = (formValues) => {
    const { username: _, ...restValues } = formValues;
    INSTANCE.post("/api/account/editProfile", restValues, {
      params: { pairId },
    })
      .then((res) => {
        dispatch(setUser({ ...res.data, matched: true, login: true }));
        successToast("Update", "Your profile has been updated.");
      })
      .catch((err) => errorToast(err, "Update"));
  };

  return (
    <BaseCard
      className="card-user"
      allowHeader
      title="Edit Profile"
      titleSize={5}
    >
      <BaseForm
        formId="edit_profile_form"
        initialValues={initialProfile}
        updater={allUpdater}
        allowSubmit
        submitText="Update Profile"
        onSubmit={handleEditProfile}
      >
        <Row>
          <Col>
            <BaseFormGroup label="Profile Picture">
              <span className="logo-list">
                {" "}
                <BaseFormInput
                  id="icon_radio_boy"
                  formId="edit_profile_form"
                  formKey={[user === "0" ? "user0" : "user1", "icon"]}
                  type="radio"
                  name="icon"
                  inputValue="0"
                  CustomInput={IconRadio}
                />
                <label htmlFor="icon_radio_boy">
                  <img src={AVATAR["0"]} alt="boy" />
                </label>{" "}
                <BaseFormInput
                  id="icon_radio_boy2"
                  formId="edit_profile_form"
                  formKey={[user === "0" ? "user0" : "user1", "icon"]}
                  type="radio"
                  name="icon"
                  inputValue="1"
                  CustomInput={IconRadio}
                />
                <label htmlFor="icon_radio_boy2">
                  <img src={AVATAR["1"]} alt="boy2" />
                </label>{" "}
                <BaseFormInput
                  id="icon_radio_girl"
                  formId="edit_profile_form"
                  formKey={[user === "0" ? "user0" : "user1", "icon"]}
                  type="radio"
                  name="icon"
                  inputValue="2"
                  CustomInput={IconRadio}
                />
                <label htmlFor="icon_radio_girl">
                  <img src={AVATAR["2"]} alt="girl" />
                </label>{" "}
                <BaseFormInput
                  id="icon_radio_girl2"
                  formId="edit_profile_form"
                  formKey={[user === "0" ? "user0" : "user1", "icon"]}
                  type="radio"
                  name="icon"
                  inputValue="3"
                  CustomInput={IconRadio}
                />
                <label htmlFor="icon_radio_girl2">
                  <img src={AVATAR["3"]} alt="girl2" />
                </label>
              </span>
            </BaseFormGroup>
          </Col>
        </Row>
        <Row>
          <Col size={6} className="pr-1">
            <BaseFormGroup label="Username (disabled)">
              <input className="form-control" value={username} disabled />
            </BaseFormGroup>
          </Col>
          <Col size={6} className="pl-1">
            <BaseFormGroup label="Nickname">
              <BaseFormInput
                formId="edit_profile_form"
                formKey={[user === "0" ? "user0" : "user1", "name"]}
                placeholder="Nickname"
              />
            </BaseFormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseFormGroup label="Budget">
              <br />
              <span style={{ display: "inline-block" }}>Total</span>
              <BaseFormInput
                formId="edit_profile_form"
                formKey={["budget", user === "0" ? "user0" : "user1", "total"]}
                type="number"
                style={{
                  display: "inline-block",
                  margin: "0 10px",
                  width: "calc(100% - 65px)",
                }}
              />
              $
            </BaseFormGroup>
          </Col>
        </Row>
        <Row>
          {Object.keys(categoryInfo).map((cat) => (
            <Col size={3} key={cat}>
              <div className="text-center">
                <span style={{ textTransform: "capitalize" }}>{cat}</span>
                <p>
                  <BaseFormInput
                    className="partition-input-dollar"
                    formId="edit_profile_form"
                    formKey={["budget", user === "0" ? "user0" : "user1", cat]}
                    validator={validator}
                    CustomInput={PercentInput}
                  />
                  $
                </p>
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            <label>Partition Rules</label>
          </Col>
          <Col size={6} className="pr-1">
            <div className="text-center">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>
                <img
                  src={ownerIcon["0"].src}
                  alt={ownerIcon["0"].alt}
                  style={{ width: "30%" }}
                />
              </a>
              <p>
                <BaseFormInput
                  formId="edit_profile_form"
                  formKey={[
                    "defaultExpenseAllocation",
                    "details",
                    "percentage",
                    "user0",
                  ]}
                  className="partition-input-percentage"
                  maxLength="2"
                  validator={validator}
                  CustomInput={PercentInput}
                />
                %
              </p>
            </div>
          </Col>
          <Col size={6} className="pl-1">
            <div className="text-center">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>
                <img
                  src={ownerIcon["1"].src}
                  alt={ownerIcon["1"].alt}
                  style={{ width: "30%" }}
                />
              </a>
              <p>
                <BaseFormInput
                  formId="edit_profile_form"
                  formKey={[
                    "defaultExpenseAllocation",
                    "details",
                    "percentage",
                    "user1",
                  ]}
                  className="partition-input-percentage"
                  maxLength="2"
                  validator={validator}
                  CustomInput={PercentInput}
                />
                %
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseFormGroup label="Anniversary (Optional)">
              <BaseFormInput
                formId="edit_profile_form"
                formKey="anniversary"
                placeholder="Anniversary"
                type="date"
              />
            </BaseFormGroup>
          </Col>
        </Row>
      </BaseForm>
    </BaseCard>
  );
}

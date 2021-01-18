/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, {
  BaseFormGroup,
  BaseFormInput,
  BaseFormSelect,
  BaseFormOption,
} from "../components/BaseForm";
import { Row, Col, IconRadio } from "../components/BaseTags";
import { AVATAR } from "../constants";

export default function EditProfile() {
  const {
    name,
    name1,
    username,
    icon,
    icon1,
    user,
    budget,
    defaultExpenseAllocation,
  } = useSelector(selectUser);
  console.log(defaultExpenseAllocation);

  // YYYY-MM-DD
  const formatDate = (date) => {
    return `${new Date(date).toISOString().split("T")[0]}`;
  };

  const initialProfile = {
    icon: user === "0" ? icon : icon1,
    username,
    name: user === "0" ? name : name1,
    lastName: "Cruise",
    budget: user === "0" ? budget.user0.total : budget.user1.total,
    partitionRule: "even split",
    anniversary: formatDate(new Date(2019, 0, 2)),
  };

  const validator = (value) => {
    const tmp = parseInt(value, 10);
    const result = Number.isNaN(tmp) || tmp < 0 ? 0 : tmp;
    return result;
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
        allowSubmit
        submitText="Update Profile"
      >
        <Row>
          <Col>
            <BaseFormGroup label="Profile Picture">
              <span className="logo-list">
                {" "}
                <BaseFormInput
                  id="icon_radio_boy"
                  formId="edit_profile_form"
                  formKey="icon"
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
                  formKey="icon"
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
                  formKey="icon"
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
                  formKey="icon"
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
              <BaseFormInput
                formId="edit_profile_form"
                formKey="username"
                placeholder="Username"
                disabled
              />
            </BaseFormGroup>
          </Col>
          <Col size={6} className="pl-1">
            <BaseFormGroup label="Nickname">
              <BaseFormInput
                formId="edit_profile_form"
                formKey="name"
                placeholder="Nickname"
              />
            </BaseFormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseFormGroup label="Budget">
              <BaseFormInput
                formId="edit_profile_form"
                formKey="budget"
                placeholder="Budget"
                type="number"
                validator={validator}
              />
            </BaseFormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseFormGroup label="Partition Rules">
              <BaseFormSelect
                formId="edit_profile_form"
                formKey="partitionRule"
              >
                <BaseFormOption
                  formId="edit_profile_form"
                  formKey="partitionRule"
                  value="even split"
                >
                  even split
                </BaseFormOption>
              </BaseFormSelect>
            </BaseFormGroup>
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

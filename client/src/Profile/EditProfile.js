/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { useSelector } from "react-redux";
import { selectInfo } from "../redux/infoSlice";

import BaseCard from "../components/BaseCard";
import BaseForm, {
  BaseFormGroup,
  BaseFormInput,
  BaseFormSelect,
} from "../components/BaseForm";
import { Row, Col, IconRadio } from "../components/BaseTags";

export default function EditProfile() {
  const { ownerIcon } = useSelector(selectInfo);
  // YYYY-MM-DD

  const formatDate = (date) => {
    return `${new Date(date).toISOString().split("T")[0]}`;
  };

  const initialProfile = {
    avatar: -1,
    username: "tom123",
    email: "tom123@gmail.com",
    firstName: "Tom",
    lastName: "Cruise",
    budget: 1050,
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
                  id="avatar_radio_boy"
                  formId="edit_profile_form"
                  formKey="avatar"
                  type="radio"
                  name="avatar"
                  inputValue={0}
                  CustomInput={IconRadio}
                />
                <label htmlFor="avatar_radio_boy">
                  <img src={ownerIcon[0].src} alt={ownerIcon[0].alt} />
                </label>{" "}
                <BaseFormInput
                  id="avatar_radio_boy2"
                  formId="edit_profile_form"
                  formKey="avatar"
                  type="radio"
                  name="avatar"
                  inputValue={2}
                  CustomInput={IconRadio}
                />
                <label htmlFor="avatar_radio_boy2">
                  <img src={ownerIcon["2"].src} alt={ownerIcon["2"].src} />
                </label>{" "}
                <BaseFormInput
                  id="avatar_radio_girl"
                  formId="edit_profile_form"
                  formKey="avatar"
                  type="radio"
                  name="avatar"
                  inputValue={1}
                  CustomInput={IconRadio}
                />
                <label htmlFor="avatar_radio_girl">
                  <img src={ownerIcon[1].src} alt={ownerIcon[1].alt} />
                </label>{" "}
                <BaseFormInput
                  id="avatar_radio_girl2"
                  formId="edit_profile_form"
                  formKey="avatar"
                  type="radio"
                  name="avatar"
                  inputValue={3}
                  CustomInput={IconRadio}
                />
                <label htmlFor="avatar_radio_girl2">
                  <img src={ownerIcon["3"].src} alt={ownerIcon["3"].src} />
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
            <BaseFormGroup label="Email address">
              <BaseFormInput
                formId="edit_profile_form"
                formKey="email"
                placeholder="Email"
                type="email"
              />
            </BaseFormGroup>
          </Col>
        </Row>
        <Row>
          <Col size={6} className="pr-1">
            <BaseFormGroup label="First Name">
              <BaseFormInput
                formId="edit_profile_form"
                formKey="firstName"
                placeholder="First Name"
              />
            </BaseFormGroup>
          </Col>
          <Col size={6} className="pl-1">
            <BaseFormGroup label="Last Name">
              <BaseFormInput
                formId="edit_profile_form"
                formKey="lastName"
                placeholder="Last Name"
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
                <option
                  style={{ textTransform: "capitalize" }}
                  value="even split"
                >
                  even split
                </option>
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

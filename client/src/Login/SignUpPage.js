/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { Row, Col, IconRadio } from "../components/BaseTags";
import {
  baseToast,
  BaseToastInner,
  errorToast,
  successToast,
} from "../components/BaseToast";
import { setCookie } from "../cookieHelper";
import { INSTANCE, AVATAR } from "../constants";

const RadioRow = styled.div`
  display: inline-block;

  label img {
    height: 48px !important;
    margin: 0 6px;
  }
`;

export default function SignUpPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { login } = useSelector(selectUser);

  useEffect(() => {
    document.title = "Sign Up | App's name";
  }, []);

  useEffect(() => {
    if (login) history.push("/");
  }, [login]);

  const handleSignUp = (formValues) => {
    const { confirmPassword, ...restValues } = formValues;
    if (restValues.password !== confirmPassword) {
      baseToast(
        <BaseToastInner
          icon="nc-icon nc-bell-55"
          title="Sign up failed."
          message="Please make sure your passwords match."
        />,
        {
          position: "top-center",
          autoClose: 6000,
          type: "alert",
        }
      );
    } else {
      INSTANCE.post("/api/account/register", restValues)
        .then((res) => {
          if (res.status === 200) {
            setCookie("accessToken", res.data.username);
            dispatch(setUser({ ...res.data, login: true }));
            successToast("Sign up", "Here is your invite code.");
          }
        })
        .catch((err) => errorToast(err, "Sign up"));
    }
  };

  const BackButton = () => (
    <div className="update ml-auto mr-auto">
      <Link to="/">
        <button type="button" className="btn btn-primary btn-round">
          Back to Login
        </button>
      </Link>
    </div>
  );

  return (
    <div className="wrapper">
      <div className="login-panel">
        <div className="login-container">
          <h1 className="title">App&apos;s name</h1>
          <BaseCard allowHeader title="Sign Up">
            <BaseForm
              formId="sign_up_form"
              initialValues={{
                icon: -1,
                name: "",
                username: "",
                password: "",
                confirmPassword: "",
              }}
              allowSubmit
              submitText="Confirm"
              onSubmit={handleSignUp}
              otherFooter={<BackButton />}
            >
              <Row>
                <Col>
                  <BaseFormGroup label="Profile Picture">
                    <span className="logo-list select-logo">
                      <RadioRow>
                        <BaseFormInput
                          id="radio_boy"
                          formId="sign_up_form"
                          formKey="icon"
                          type="radio"
                          name="icon"
                          inputValue="0"
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_boy">
                          <img src={AVATAR["0"]} alt="boy" />
                        </label>
                        <BaseFormInput
                          id="radio_boy2"
                          formId="sign_up_form"
                          formKey="icon"
                          type="radio"
                          name="icon"
                          inputValue="1"
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_boy2">
                          <img src={AVATAR["1"]} alt="boy2" />
                        </label>
                        <BaseFormInput
                          id="radio_girl"
                          formId="sign_up_form"
                          formKey="icon"
                          type="radio"
                          name="icon"
                          inputValue="2"
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_girl">
                          <img src={AVATAR["2"]} alt="girl" />
                        </label>
                        <BaseFormInput
                          id="radio_girl2"
                          formId="sign_up_form"
                          formKey="icon"
                          type="radio"
                          name="icon"
                          inputValue="3"
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_girl2">
                          <img src={AVATAR["3"]} alt="girl2" />
                        </label>
                      </RadioRow>
                    </span>
                  </BaseFormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <BaseFormGroup label="Nickname">
                    <BaseFormInput
                      formId="sign_up_form"
                      formKey="name"
                      placeholder="Nickname"
                    />
                  </BaseFormGroup>
                </Col>
                <Col>
                  <BaseFormGroup label="Username">
                    <BaseFormInput
                      formId="sign_up_form"
                      formKey="username"
                      placeholder="Username"
                    />
                  </BaseFormGroup>
                </Col>
                <Col>
                  <BaseFormGroup label="Password">
                    <BaseFormInput
                      formId="sign_up_form"
                      formKey="password"
                      placeholder="Password"
                      type="password"
                    />
                  </BaseFormGroup>
                </Col>
                <Col>
                  <BaseFormGroup label="Confirm Password">
                    <BaseFormInput
                      formId="sign_up_form"
                      formKey="confirmPassword"
                      placeholder="Confirm Password"
                      type="password"
                    />
                  </BaseFormGroup>
                </Col>
              </Row>
            </BaseForm>
          </BaseCard>
        </div>
      </div>
    </div>
  );
}

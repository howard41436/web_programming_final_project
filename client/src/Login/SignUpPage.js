/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { Row, Col, IconRadio } from "../components/BaseTags";
import { baseToast, BaseToastInner } from "../components/BaseToast";
import { setCookie } from "../cookieHelper";
import { INSTANCE } from "../constants";

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
  const { ownerIcon } = useSelector(selectInfo);

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
            const accesToken = {
              username: res.data.username,
              inviteCode: res.data.inviteCode,
            };
            setCookie("accessToken", JSON.stringify(accesToken));
            dispatch(setUser(res.data));
          }
        })
        .catch((err) => {
          baseToast(
            <BaseToastInner
              icon="nc-icon nc-bell-55"
              title="Sign up failed."
              message={err.response.data}
            />,
            {
              position: "top-center",
              autoClose: 6000,
              type: "alert",
            }
          );
        });
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
                          id="radio_boy1"
                          formId="sign_up_form"
                          formKey="owner"
                          type="radio"
                          name="owner"
                          inputValue={0}
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_boy1">
                          <img src={ownerIcon[0].src} alt={ownerIcon[0].alt} />
                        </label>
                        <BaseFormInput
                          id="radio_boy2"
                          formId="sign_up_form"
                          formKey="owner"
                          type="radio"
                          name="owner"
                          inputValue={2}
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_boy2">
                          <img src={ownerIcon[2].src} alt={ownerIcon[2].alt} />
                        </label>
                        <BaseFormInput
                          id="radio_girl1"
                          formId="sign_up_form"
                          formKey="owner"
                          type="radio"
                          name="owner"
                          inputValue={1}
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_girl1">
                          <img src={ownerIcon[1].src} alt={ownerIcon[1].alt} />
                        </label>
                        <BaseFormInput
                          id="radio_girl2"
                          formId="sign_up_form"
                          formKey="owner"
                          type="radio"
                          name="owner"
                          inputValue={3}
                          CustomInput={IconRadio}
                        />
                        <label htmlFor="radio_girl2">
                          <img src={ownerIcon[3].src} alt={ownerIcon[3].alt} />
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

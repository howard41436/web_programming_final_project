import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { Row, Col } from "../components/BaseTags";
import { baseToast, BaseToastInner } from "../components/BaseToast";
import { setCookie } from "../cookieHelper";
import { INSTANCE } from "../constants";

export default function SignUpPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { login } = useSelector(selectUser);

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
            >
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

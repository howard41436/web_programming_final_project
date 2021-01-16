import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { baseToast, BaseToastInner } from "../components/BaseToast";
import { Row, Col } from "../components/BaseTags";
import { setCookie } from "../cookieHelper";
import { INSTANCE } from "../constants";

export default function LoginPage() {
  const dispatch = useDispatch();

  const SignUpButton = () => (
    <div className="update ml-auto mr-auto">
      <Link to="/signup">
        <button type="button" className="btn btn-primary btn-round">
          Sign Up
        </button>
      </Link>
    </div>
  );

  const handleLogin = (formValues) => {
    INSTANCE.post("/api/account/login", formValues)
      .then((res) => {
        if (res.status === 200) {
          const accesToken = {
            pairId: res.data.pairId,
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
            title="Login failed."
            message={err.response.data}
          />,
          {
            position: "top-center",
            autoClose: 6000,
            type: "alert",
          }
        );
      });
  };

  return (
    <div className="wrapper">
      <div className="login-panel">
        <div className="login-container">
          <h1 className="title">App&apos;s name</h1>
          <BaseCard allowHeader title="Login">
            <BaseForm
              formId="login_form"
              initialValues={{ username: "", password: "" }}
              allowSubmit
              submitText="Login"
              onSubmit={handleLogin}
              otherFooter2={<SignUpButton />}
            >
              <Row>
                <Col>
                  <BaseFormGroup label="Username">
                    <BaseFormInput
                      formId="login_form"
                      formKey="username"
                      placeholder="Username"
                    />
                  </BaseFormGroup>
                </Col>
                <Col>
                  <BaseFormGroup label="Password">
                    <BaseFormInput
                      formId="login_form"
                      formKey="password"
                      type="password"
                      placeholder="Password"
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
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { errorToast } from "../components/BaseToast";
import { Row, Col } from "../components/BaseTags";
import { setCookie } from "../cookieHelper";
import { INSTANCE } from "../constants";

export default function LoginPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "App's name";
  }, []);

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
          setCookie("accessToken", res.data.username);
          dispatch(setUser({ ...res.data, login: true }));
        }
      })
      .catch((err) => errorToast(err, "Login"));
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

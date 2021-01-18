import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { baseToast, BaseToastInner } from "../components/BaseToast";
import { Row, Col } from "../components/BaseTags";
import { setCookie, deleteCookie } from "../cookieHelper";
import { INSTANCE } from "../constants";

const CodeInput = styled.input`
  border-radius: 0;
  color: black;
  padding: 0 !important;

  :focus {
    border: none;
    box-shadow: none;
    color: gray;
  }
`;

export default function InvitationPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { username, inviteCode } = useSelector(selectUser);

  useEffect(() => {
    document.title = "Invitation | App's name";
  }, []);

  const handleMatch = ({ inviteCode: code }) => {
    INSTANCE.post("/api/account/match", {
      username,
      inviteCode: code,
    })
      .then((res) => {
        setCookie("accessToken", res.data.username);
        dispatch(setUser({ ...res.data, login: true }));
      })
      .catch((err) =>
        baseToast(
          <BaseToastInner
            icon="nc-icon nc-bell-55"
            title="Match failed."
            message={err.response.data}
          />,
          {
            position: "top-center",
            autoClose: 6000,
            type: "alert",
          }
        )
      );
  };

  const handleLogOut = (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;
    deleteCookie();
    dispatch(setUser({ login: false }));
    history.push("/");
  };

  const LogOutButton = () => (
    <div className="update ml-auto mr-auto">
      <button
        type="button"
        className="btn btn-primary btn-round"
        onClick={handleLogOut}
      >
        Log Out
      </button>
    </div>
  );

  return (
    <div className="wrapper">
      <div className="login-panel">
        <div className="login-container">
          <h1 className="title">App&apos;s name</h1>
          <BaseCard allowHeader title="My Invitation Code">
            <BaseForm
              formId="invitation_form"
              initialValues={{ inviteCode: "" }}
              allowSubmit
              submitText="Confirm"
              onSubmit={handleMatch}
              otherFooter2={<LogOutButton />}
            >
              <Row>
                <Col>
                  <h2 className="invitation-code">{inviteCode}</h2>
                </Col>
                <Col>
                  <BaseFormGroup label="Partner's Invitation Code">
                    <h2 style={{ textAlign: "center" }}>
                      <BaseFormInput
                        formId="invitation_form"
                        formKey="inviteCode"
                        className="invitation-code-input"
                        maxLength="5"
                        CustomInput={CodeInput}
                      />
                    </h2>
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

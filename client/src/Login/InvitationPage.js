import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { Row, Col } from "../components/BaseTags";
import { getCookie, setCookie } from "../cookieHelper";
import { INSTANCE } from "../constants";

export default function InvitationPage() {
  const dispatch = useDispatch();

  const getUserJSON = (str) => {
    let obj;
    try {
      obj = JSON.parse(str);
    } catch {
      obj = {};
    } finally {
      if (obj === null) obj = {};
    }
    return obj;
  };

  const { username, inviteCode } = getUserJSON(getCookie());

  const handleMatch = ({ inviteCode: code }) => {
    INSTANCE.post("/api/account/match", {
      username,
      inviteCode: code,
    }).then((res) => {
      const accessToken = {
        pairId: res.data.pairId,
        username: res.data.username,
      };
      setCookie("accessToken", JSON.stringify(accessToken));
      dispatch(setUser(res.data));
    });
  };

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
            >
              <Row>
                <Col>
                  <h2 style={{ textAlign: "center" }}>
                    <span
                      style={{
                        backgroundColor: "grey",
                        color: "white",
                        padding: "5px",
                      }}
                    >
                      {inviteCode}
                    </span>
                  </h2>
                </Col>
                <Col>
                  <BaseFormGroup label="Partner's Invitation Code">
                    <BaseFormInput
                      formId="invitation_form"
                      formKey="inviteCode"
                      placeholder="Invitation Code"
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

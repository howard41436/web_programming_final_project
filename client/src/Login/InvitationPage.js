import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import BaseCard from "../components/BaseCard";
import BaseForm, { BaseFormGroup, BaseFormInput } from "../components/BaseForm";
import { baseToast, BaseToastInner } from "../components/BaseToast";
import { Row, Col } from "../components/BaseTags";
import { getCookie, setCookie, deleteCookie } from "../cookieHelper";
import { INSTANCE } from "../constants";

export default function InvitationPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Invitation | App's name";
  }, []);

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
    })
      .then((res) => {
        const accessToken = {
          pairId: res.data.pairId,
          username: res.data.username,
        };
        setCookie("accessToken", JSON.stringify(accessToken));
        dispatch(setUser(res.data));
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
                  <h2 style={{ textAlign: "center" }}>
                    <span className="invitation-code">{inviteCode}</span>
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

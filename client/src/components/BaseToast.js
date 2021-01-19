import React from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { setToast, selectToast } from "../redux/toastSlice";
import { Button } from "./BaseTags";

const ToastContainerCustom = styled(ToastContainer)`
  > div {
    padding: 8.4px 20px 8.4px 0px !important;
    min-width: 325px;
  }
`;

const ToastIcon = styled.span`
  display: block;
  font-size: 27px;
  left: 19px;
  margin-top: -11px;
  position: absolute;
  top: 50%;
`;

const ToastMessage = styled.span`
  display: block;
  max-width: 95%;
  font-family: Montserrat, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  padding-left: ${({ hasIcon }) => (hasIcon ? "65px" : "20px")};
  padding-top: calc(0.9rem - 8px);
  padding-bottom: calc(0.9rem - 8px);
  text-transform: capitalize;
`;

const ToastClose = styled.button.attrs({
  type: "button",
  ariaHidden: "true",
  className: "close",
})`
  color: #ffffff;
  height: 25px;
  line-height: 0;
  margin-top: -13px;
  opacity: 0.9;
  position: absolute;
  right: 10px;
  text-shadow: none;
  top: 50%;
  z-index: 1062;
  width: 25px;

  :focus {
    outline: none;
  }

  i {
    font-size: 14px !important;
  }
`;

const ToastBackdrop = styled.div`
  background: black;
  display: ${({ show }) => (show ? "block" : "none")};
  height: 200vh;
  left: -100vw;
  opacity: 0.3;
  position: fixed;
  top: -100vh;
  width: 200vw;
  z-index: 1055;
`;

export const BaseToastInner = (props) => {
  const {
    icon = "",
    title = "",
    message = "",
    allowButton = false,
    buttonClasses = "",
    buttonRound = "",
    buttonTheme = "",
    buttonText = "OK",
    buttonAction = () => {},
  } = props;

  return (
    <>
      {icon && <ToastIcon className={icon} />}
      <ToastMessage hasIcon={icon !== ""}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <br />
        {message}
        {allowButton && (
          <>
            <br />
            <Button
              type="submit"
              className={buttonClasses}
              round={buttonRound}
              theme={buttonTheme}
              onClick={buttonAction}
            >
              {buttonText}
            </Button>
          </>
        )}
      </ToastMessage>
    </>
  );
};

export const baseToast = (toastInner, options) => {
  const {
    backdrop = false,
    type = "primary",
    dispatch,
    ...toastOptions
  } = options;

  const bodyStyle = {
    primary: { background: "#65d1d4", color: "white" },
    alert: { background: "#f1926e", color: "white" },
  };

  const progressStyle = {
    primary: { background: "rgba(255, 255, 255, 0.7)" },
    alert: { background: "rgba(255, 255, 255, 0.7)" },
  };

  const toastId = toast(toastInner, {
    ...toastOptions,
    style: bodyStyle[type],
    progressStyle: progressStyle[type],
    transition: Slide,
  });

  if (backdrop) {
    dispatch(setToast({ backdrop: toastId }));
  }
};

export default function BaseToast() {
  const dispatch = useDispatch();
  const { backdrop } = useSelector(selectToast);

  const CloseButton = ({ closeToast }) => (
    <ToastClose onClick={closeToast}>
      <i className="nc-icon nc-simple-remove" />
    </ToastClose>
  );

  toast.onChange(() =>
    dispatch(setToast({ backdrop: toast.isActive(backdrop) ? backdrop : "" }))
  );

  return (
    <>
      <ToastContainerCustom closeButton={<CloseButton />} />
      <ToastBackdrop show={backdrop !== ""} />
    </>
  );
}

export const errorToast = (err, title) => {
  baseToast(
    <BaseToastInner
      icon="nc-icon nc-bell-55"
      title={`${title} failed.`}
      message={err.response.data || "Network error."}
    />,
    {
      position: "top-center",
      autoClose: 6000,
      type: "alert",
    }
  );
};

export const successToast = (title, message) => {
  baseToast(
    <BaseToastInner
      icon="nc-icon nc-check-2"
      title={`${title} successfully.`}
      message={message}
    />,
    {
      position: "top-center",
      autoClose: 6000,
    }
  );
};

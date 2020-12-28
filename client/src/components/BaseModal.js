import React, { useEffect, useRef } from "react";

export default function BaseModal(props) {
  const {
    show = false,
    setShow = () => {},
    modalId = "", // Should be unique
    title = "",
    children = <></>,
  } = props;

  const handleSetShow = (s) => () => {
    setShow(s);
  };

  const handleModalClick = (e) => e.stopPropagation();

  const openRef = useRef();
  const closeRef = useRef();

  useEffect(() => {
    if (show) openRef.current.click();
    else closeRef.current.click();
  }, [show]);

  return (
    <>
      <button
        data-toggle="modal"
        data-target={`#${modalId}`}
        ref={openRef}
        style={{ display: "none" }}
        type="button"
      >
        {" "}
      </button>
      <div
        className="content modal fade center my_base_modal"
        id={modalId}
        onClick={handleSetShow(false)}
        onKeyDown={handleSetShow(false)}
        style={{ outline: "none" }}
        role="button"
        tabIndex={0}
      >
        <div
          className="row modal-dialog modal-content"
          onClick={handleModalClick}
          onKeyDown={handleModalClick}
          style={{ outline: "none" }}
          role="button"
          tabIndex={0}
        >
          <div className="col-md-12">
            <div className="card card-user">
              <div className="card-header">
                <h5 className="card-title">{title}</h5>
              </div>
              <div
                className="close-modal"
                style={{ height: "auto", width: "auto" }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  ref={closeRef}
                  data-dismiss="modal"
                  onClick={handleSetShow(false)}
                  onKeyDown={handleSetShow(false)}
                  style={{ outline: "none" }}
                  role="button"
                  tabIndex={0}
                >
                  <i className="fas fa-times" />
                </a>
              </div>
              <div className="card-body">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

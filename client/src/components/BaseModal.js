import React, { useEffect, useRef } from "react";
import BaseCard from "./BaseCard";
import { Row, Col, Button } from "./BaseTags";

export default function BaseModal(props) {
  const {
    show = false,
    setShow = () => {},
    modalId = "", // Should be unique
    title = "",
    children = <></>,
  } = props;

  const handleSetShow = (s) => (e) => {
    if (e.type === "keydown") return;
    setShow(s);
  };

  const handleModalClick = (e) => e.stopPropagation();
  const openRef = useRef();
  const closeRef = useRef();

  useEffect(() => {
    return () => {
      if (document.getElementsByClassName("modal-backdrop")[0])
        document.getElementsByClassName("modal-backdrop")[0].remove();
    }; // Remove backdrop
  }, []);

  useEffect(() => {
    if (show) openRef.current.click();
    else closeRef.current.click();
  }, [show]);

  const CloseButton = () => (
    <div className="close-modal" style={{ fontSize: "14px", top: "14px" }}>
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
  );

  return (
    <>
      <Button
        data-toggle="modal"
        data-target={`#${modalId}`}
        ref={openRef}
        style={{ display: "none" }}
        type="button"
      />
      <div
        className="content modal fade center my_base_modal"
        id={modalId}
        onClick={handleSetShow(false)}
        onKeyDown={handleSetShow(false)}
        style={{ outline: "none" }}
        role="button"
        tabIndex={0}
      >
        <Row
          className="modal-dialog modal-content"
          onClick={handleModalClick}
          onKeyDown={handleModalClick}
          style={{ outline: "none" }}
        >
          <Col>
            <BaseCard
              className="card-user"
              allowHeader
              title={title}
              otherHeader={<CloseButton />}
            >
              {children}
            </BaseCard>
          </Col>
        </Row>
      </div>
    </>
  );
}

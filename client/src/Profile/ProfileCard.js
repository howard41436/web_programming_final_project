import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectInfo } from "../redux/infoSlice";

import BaseCard from "../components/BaseCard";
import { Col, Row } from "../components/BaseTags";
import { PUBLIC_URL } from "../constants";

const PictureCard = styled(BaseCard)`
  .card-header {
    padding: 0 !important;
  }
  a h5 {
    color: #51cbce;
  }
`;

export default function ProfileCard() {
  const { ownerIcon } = useSelector(selectInfo);

  const CardHeader = () => (
    <div className="image">
      <img src={PUBLIC_URL("/img/damir-bosnjak.jpg")} alt="profile-header" />
    </div>
  );

  const CardFooter = () => (
    <div className="button-container">
      <Row>
        <Col size={6} otherSize={{ default: 6, lg: 3 }} className="ml-auto">
          <h5>
            12
            <br />
            <small>Stores</small>
          </h5>
        </Col>
        <Col
          size={6}
          otherSize={{ default: 6, lg: 4 }}
          className="ml-auto mr-auto"
        >
          <h5>
            100
            <br />
            <small>Days</small>
          </h5>
        </Col>
        <Col otherSize={{ lg: 3 }} className="mr-auto">
          <h5>
            24,6 $
            <br />
            <small>Spent</small>
          </h5>
        </Col>
      </Row>
    </div>
  );

  return (
    <PictureCard
      className="card-user"
      allowHeader
      headerStyle={{ margin: 0 }}
      otherHeader={<CardHeader />}
      allowFooter
      footer={<CardFooter />}
    >
      <div className="author">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">
          <img
            className="avatar border-gray"
            src={ownerIcon[0].src}
            alt={ownerIcon[0].alt}
          />
          <h5 className="title">Tom</h5>
        </a>
        <p className="description">@tom123</p>
        <p className="description text-center">
          In a relationship with Amy{" "}
          <img
            className="logo-image-small"
            src={ownerIcon[-1].src}
            alt={ownerIcon[-1].alt}
          />
          <br />
          Since 2019 / 01 / 01
        </p>
      </div>
    </PictureCard>
  );
}

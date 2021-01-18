import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

import BaseCard from "../components/BaseCard";
import { Col, Row } from "../components/BaseTags";
import { PUBLIC_URL, AVATAR } from "../constants";

const PictureCard = styled(BaseCard)`
  .card-header {
    padding: 0 !important;
  }
  a h5 {
    color: #51cbce;
  }
`;

export default function ProfileCard() {
  const {
    user0: { name, icon },
    user1: { name: name1, icon: icon1 },
    username,
    user,
    anniversary,
  } = useSelector(selectUser);

  // YYYY-MM-DD
  const formatDate = (date) => {
    return `${new Date(date)
      .toISOString()
      .split("T")[0]
      .replaceAll("-", " / ")}`;
  };

  const DiffDate = (date) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date() - new Date(date)) / oneDay));
  };

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
            {DiffDate(anniversary)}
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
        <a style={{ pointerEvents: "none" }}>
          <img
            className="avatar border-gray"
            src={AVATAR[user === "0" ? icon : icon1]}
            alt="avatar"
          />
          <h5 className="title">{user === "0" ? name : name1}</h5>
        </a>
        <p className="description">@{username}</p>
        <p className="description text-center">
          In a relationship with {user === "0" ? name1 : name}{" "}
          <img
            className="logo-image-small"
            src={AVATAR[`${icon}${icon1}`]}
            alt="both"
          />
          <br />
          Since {formatDate(anniversary)}
        </p>
      </div>
    </PictureCard>
  );
}

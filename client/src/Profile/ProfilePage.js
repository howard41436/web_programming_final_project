import React, { useEffect } from "react";

import BasePage from "../components/BasePage";
import { Row, Col } from "../components/BaseTags";
import ProfileCard from "./ProfileCard";
import EditProfile from "./EditProfile";

export default function ProfilePage() {
  useEffect(() => {
    document.title = "Profile | Together";
  }, []);

  return (
    <BasePage title="My Profile">
      <Row>
        <Col size={4}>
          <ProfileCard />
        </Col>
        <Col size={8}>
          <EditProfile />
        </Col>
      </Row>
    </BasePage>
  );
}

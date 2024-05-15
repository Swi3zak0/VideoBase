import { Route, Routes, NavLink, Navigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import ChangePassword from "./ChangePassword";
import Account from "./Account";
import DeleteAccount from "./DeleteAccount";

function Settings() {
  return (
    <Container fluid>
      <Row>
        <Col md={2}>
          <Card>
            <Card.Header>My Profile</Card.Header>
            <div className="nav-section">
              <NavLink to="account" className="nav-link">
                My Account
              </NavLink>
              <NavLink to="changePassword" className="nav-link">
                Change Password
              </NavLink>
              <NavLink to="deleteAccount" className="nav-link">
                Delete Account
              </NavLink>
            </div>
          </Card>
        </Col>
        <Col md={6}>
          <Routes>
            <Route path="changePassword" element={<ChangePassword />} />
            <Route path="account" element={<Account />} />
            <Route path="/" element={<Navigate to="account" />} />
            <Route path="deleteAccount" element={<DeleteAccount />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;

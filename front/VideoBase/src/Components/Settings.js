import { Route, Routes, NavLink, Navigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import ChangePassword from "./ChangePassword";
import Account from "./Account";
import DeleteAccount from "./DeleteAccount";
import Contact from "./Contact";
import Terms from "./Terms";
import { useTranslation } from "react-i18next";

function Settings() {
  const { t } = useTranslation();

  return (
    <Container fluid>
      <Row className=" gx-5">
        <Col md={2}>
          <Card className="settings-form">
            <Card.Header>{t("myProfile")}</Card.Header>
            <div className="nav-section">
              <NavLink to="account" className="nav-link">
                {t("myAccount")}
              </NavLink>
              <NavLink to="changePassword" className="nav-link">
                {t("changePassword")}
              </NavLink>
              <NavLink to="deleteAccount" className="nav-link">
                {t("deleteAccount")}
              </NavLink>
              <NavLink to="contact" className="nav-link">
                {t("contactUs")}
              </NavLink>
              <NavLink to="terms" className="nav-link">
                {t("termsAndConditions")}
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
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;

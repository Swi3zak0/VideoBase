import React from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  Navbar,
  Nav,
} from "react-bootstrap";
import logo from "../Images/logo.png";
import { LinkContainer } from "react-router-bootstrap";
import { Logout } from "./Logout";
import { Search } from "./Search";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function TopNav() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const { logout } = Logout();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const username = localStorage.getItem("username");

  return (
    <Container fluid className="no-padding">
      <Navbar className="sticky-navbar">
        <Navbar.Brand href="/" className="navbar-brand-custom">
          <img
            src={logo}
            width="60"
            height="60"
            className="d-inline-block align-top"
            alt="logo"
          />
          VideoBase
        </Navbar.Brand>
        <Search />
        <Nav id="basic-navbar-nav" data-bs-theme="dark">
          {!isLoggedIn ? (
            <>
              <LinkContainer to="/uploadVideo">
                <Nav.Link className="nav-links">{t("addVideo")}</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link className="nav-links">{t("signIn")}</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link className="nav-links">{t("signUp")}</Nav.Link>
              </LinkContainer>
            </>
          ) : (
            <>
              <Button variant="outline-light" href="/uploadVideo">
                {t("addVideo")}
              </Button>
              <Dropdown as={ButtonGroup}>
                <Button variant="outline-light">
                  {t("hello")} {username} !
                </Button>
                <Dropdown.Toggle
                  split
                  variant="light"
                  id="dropdown-split-basic"
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate("/myProfile")}>
                    {t("myProfile")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/settings")}>
                    {t("settings")}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout} variant="light">
                    {t("logout")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Nav>
      </Navbar>
    </Container>
  );
}

export default TopNav;

import "../CSS/Styles.css";
import { Button, ButtonGroup, Container, Dropdown } from "react-bootstrap";
import logo from "../Images/logo.png";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Logout } from "./Logout";
import { Search } from "./Search";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function TopNav() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const { logout } = Logout();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const username = localStorage.getItem("username");

  return (
    <Container fluid className="no-padding">
      <Navbar className="sticky-navbar">
        <Navbar.Brand href="/home" className="navbar-brand-custom">
          <img
            src={logo}
            width="40"
            height="40"
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
                <Nav.Link className="nav-links"> {t("addVideo")}</Nav.Link>
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
                  <Dropdown.Item>{t("myProfile")}</Dropdown.Item>
                  <Dropdown.Item>{t("myLibrary")}</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/changePassword")}>
                    {t("changePassword")}
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

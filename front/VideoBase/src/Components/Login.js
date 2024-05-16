import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "../CSS/button.css";
import "../CSS/form.css";
import "../CSS/base.css";
import "../CSS/utilities.css";
import "../CSS/navbar.css";
import "../CSS/layout.css";
import "../CSS/card.css";
import "../CSS/col.css";
import "../CSS/video.css";
import "../CSS/footer.css";
import "../CSS/row.css";

const LOGIN_MUTATION = gql`
  mutation Mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        username
        email
        id
      }
      success
    }
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.loginUser.success) {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        localStorage.setItem("username", data.loginUser.user.username);
        localStorage.setItem("userId", data.loginUser.user.id);
        const email = data.loginUser.user.email;
        const email2 = email.split("@")[0];
        localStorage.setItem("email", email2);
        console.log(data.loginUser.user.email);
      } else {
        setLoginError(t("loginError"));
      }
    },
    onError: () => {
      setLoginError(t("networkError"));
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login({
      variables: {
        username: username,
        password: password,
      },
    });
  };

  return (
    <div className="standard-form">
      <Form onSubmit={handleSubmit}>
        <h1>{t("signIn")}</h1>
        <Form.Group controlId="username">
          <Form.Label>{t("username")}</Form.Label>
          <Form.Control
            autoFocus
            placeholder={t("username")}
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>{t("password")}</Form.Label>
          <div className="password-input">
            <Form.Control
              placeholder={t("password")}
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              variant="light"
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </Button>
          </div>
        </Form.Group>
        <Link to="/resetPassword" className="links">
          {t("forgotPassword")}
        </Link>
        <Button variant="dark" className="button" type="submit">
          {t("logInButton")}
        </Button>
        {loginError && <p className="text-danger">{loginError}</p>}
        <p>
          {t("noAccount")}{" "}
          <Link to="/register" className="links">
            {t("registerNow")}
          </Link>
        </p>
      </Form>
    </div>
  );
}
export default Login;

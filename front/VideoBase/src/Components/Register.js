import { Button, Form, FormGroup, FormCheck } from "react-bootstrap";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import PasswordStrengthBar from "react-password-strength-bar";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const registerMutation = gql`
  mutation RegisterUser(
    $username: String!
    $password: String!
    $email: String!
  ) {
    registerUser(username: $username, password: $password, email: $email) {
      user {
        username
        email
      }
    }
  }
`;

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [statusRegister, setStatusRegister] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();

  const [register] = useMutation(registerMutation, {
    onCompleted: () => {
      setStatusRegister(t("registrationSuccess"));
      resetFormFields();
      setIsSuccess(true);
    },
    onError: () => {
      setStatusRegister(t("registrationError"));
      setIsSuccess(false);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register({
      variables: {
        username: username,
        password: password,
        email: email,
      },
    });
  };

  const handleTermsCheckboxChange = () => {
    setIsTermsChecked(!isTermsChecked);
  };

  const resetFormFields = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setIsTermsChecked(false);
  };

  return (
    <div className="standard-form">
      <Form onSubmit={handleSubmit}>
        <h1>{t("signUp")}</h1>
        <Form.Group controlId="username" size="lg">
          <Form.Label>{t("username")}</Form.Label>
          <Form.Control
            autoFocus
            placeholder={t("username")}
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email" size="lg">
          <Form.Label>{t("email")}</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
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
          <PasswordStrengthBar password={password} />
        </Form.Group>
        <FormGroup>
          <FormCheck
            type="checkbox"
            label={
              <span>
                {t("acceptTerms")}{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="links"
                >
                  {t("termsAndConditions")}
                </Link>
              </span>
            }
            checked={isTermsChecked}
            onChange={handleTermsCheckboxChange}
          />
        </FormGroup>
        <Button
          variant="dark"
          className="button"
          type="submit"
          disabled={!isTermsChecked}
        >
          {t("registerButton")}
        </Button>
        {statusRegister && (
          <p className={`text-${isSuccess ? "success" : "danger"}`}>
            {statusRegister}
          </p>
        )}
      </Form>
    </div>
  );
}

export default Registration;

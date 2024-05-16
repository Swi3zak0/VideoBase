import React, { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const NEW_PASSWORD_MUTATION = gql`
  mutation Mutation(
    $newPassword: String!
    $newPassword2: String!
    $resetCode: String!
    $uid: String!
  ) {
    resetPassword(
      newPassword: $newPassword
      newPassword2: $newPassword2
      resetCode: $resetCode
      uid: $uid
    ) {
      success
    }
  }
`;

const NewPassword = () => {
  const [newPassword, setPassword] = useState("");
  const [newPassword2, setPassword2] = useState("");
  const { uid, reset_code } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [statusPassword, setStatusPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [resetPassword] = useMutation(NEW_PASSWORD_MUTATION, {
    onCompleted: (data) => {
      if (data.resetPassword.success) {
        setStatusPassword(t("passwordChanged"));
        setIsSuccess(true);
        navigate("/login");
      } else {
        setStatusPassword(t("incorrectData"));
        setIsSuccess(false);
      }
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await resetPassword({
      variables: {
        newPassword: newPassword,
        newPassword2: newPassword2,
        uid: uid,
        resetCode: reset_code,
      },
    });
  };

  return (
    <div className="standard-form">
      <Form onSubmit={handleSubmit}>
        <h1>{t("changeYourPassword")}</h1>
        <FormGroup controlId="password">
          <FormLabel>{t("password")}</FormLabel>
          <div className="password-input">
            <FormControl
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              value={newPassword}
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
          <FormLabel>{t("repeatNewPassword")}</FormLabel>
          <div className="password-input">
            <FormControl
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("repeatNewPassword")}
              value={newPassword2}
              onChange={(event) => setPassword2(event.target.value)}
            />
            <Button
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              variant="light"
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </Button>
          </div>
        </FormGroup>
        <Button className="button" type="submit">
          {t("change")}
        </Button>
        {statusPassword && (
          <p className={`text-${isSuccess ? "success" : "danger"}`}>
            {statusPassword}
          </p>
        )}
      </Form>
    </div>
  );
};
export default NewPassword;

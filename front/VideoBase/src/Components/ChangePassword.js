import React, { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useMutation, gql } from "@apollo/client";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword(
    $oldPassword: String!
    $newPassword: String!
    $newPasswordRepeat: String!
  ) {
    changePassword(
      oldPassword: $oldPassword
      newPassword: $newPassword
      newPasswordRepeat: $newPasswordRepeat
    ) {
      success
    }
  }
`;

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordRepeat, setShowNewPasswordRepeat] = useState(false);
  const [statusPassword, setStatusPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();

  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: (data) => {
      if (data.changePassword.success) {
        setStatusPassword(t("passwordChanged"));
        setIsSuccess(true);
        resetFormFields();
      } else {
        setStatusPassword(t("incorrectData"));
        setIsSuccess(false);
      }
    },
    onError: (error) => {
      setStatusPassword(error.message);
      setIsSuccess(false);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await changePassword({
      variables: {
        oldPassword: oldPassword,
        newPassword: newPassword,
        newPasswordRepeat: newPasswordRepeat,
      },
    });
  };

  const resetFormFields = () => {
    setOldPassword("");
    setNewPassword("");
    setNewPasswordRepeat("");
  };

  return (
    <div className="change-form">
      <Form onSubmit={handleSubmit}>
        <h1>{t("changePassword")}</h1>
        <FormGroup controlId="password">
          <FormLabel>{t("oldPassword")}</FormLabel>
          <div className="password-input">
            <FormControl
              name="password1"
              type="text"
              placeholder={t("oldPassword")}
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
            />
          </div>
          <FormLabel>{t("newPassword")}</FormLabel>
          <div className="password-input">
            <FormControl
              name="password2"
              type={showNewPassword ? "text" : "password"}
              placeholder={t("newPassword")}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <Button
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
              variant="light"
            >
              {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </Button>
          </div>
          <FormLabel>{t("repeatNewPassword")}</FormLabel>
          <div className="password-input">
            <FormControl
              name="password3"
              type={showNewPasswordRepeat ? "text" : "password"}
              placeholder={t("repeatNewPassword")}
              value={newPasswordRepeat}
              onChange={(event) => setNewPasswordRepeat(event.target.value)}
            />
            <Button
              className="toggle-password"
              onClick={() => setShowNewPasswordRepeat(!showNewPasswordRepeat)}
              variant="light"
            >
              {showNewPasswordRepeat ? (
                <EyeOutlined />
              ) : (
                <EyeInvisibleOutlined />
              )}
            </Button>
          </div>
        </FormGroup>
        <Button variant="dark" className="button" type="submit">
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

export default ChangePassword;

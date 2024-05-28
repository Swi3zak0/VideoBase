import React from "react";
import { Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function DeleteAccount() {
  const { t } = useTranslation();

  const handleDeleteAccount = () => {
    console.log("Account deleted");
  };

  return (
    <div className="change-form">
      <Alert variant="warning">
        <Alert.Heading>{t("deleteAccountTitle")}</Alert.Heading>
        <p>{t("deleteAccountWarning")}</p>
      </Alert>
      <Button variant="danger" onClick={handleDeleteAccount}>
        {t("deleteAccountButton")}
      </Button>
    </div>
  );
}

export default DeleteAccount;

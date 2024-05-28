import React from "react";
import { Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const DELETE_USER_ACCOUNT_MUTATION = gql`
  mutation DeleteUserAccount {
    deleteUserAccount {
      success
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    deleteRefreshTokenCookie {
      deleted
    }
    deleteTokenCookie {
      deleted
    }
  }
`;

function DeleteAccount() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteUserAccount] = useMutation(DELETE_USER_ACCOUNT_MUTATION, {
    onCompleted: (data) => {
      if (data.deleteUserAccount.success) {
        logoutUser();
      } else {
        console.error("Failed to delete account");
      }
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
    },
  });

  const [logoutUser] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      localStorage.removeItem("username");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("fileName");
      navigate("/");
    },
    onError: (error) => {
      console.error("Error logging out:", error);
    },
  });

  const handleDeleteAccount = () => {
    deleteUserAccount();
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

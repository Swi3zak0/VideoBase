import React from "react";
import { Button, Alert } from "react-bootstrap";

function DeleteAccount() {
  const handleDeleteAccount = () => {
    console.log("Account deleted");
  };

  return (
    <div className="change-form">
      <Alert variant="warning">
        <Alert.Heading>
          Are you sure you want to delete your account?
        </Alert.Heading>
        <p>
          This action cannot be undone. Please make sure you want to proceed.
        </p>
      </Alert>
      <Button variant="danger" onClick={handleDeleteAccount}>
        Delete My Account
      </Button>
    </div>
  );
}

export default DeleteAccount;

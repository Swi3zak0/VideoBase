import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";

const RESET_PASSWORD_MUTATION = gql`
  mutation Mutation($email: String!) {
    requestPasswordReset(email: $email) {
      success
    }
  }
`;

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [statusEmail, setStatusEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();

  const [sendEmail] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: (data) => {
      if (data.requestPasswordReset.success) {
        setStatusEmail(t("passwordResetLinkSent"));
        setIsSuccess(true);
      } else {
        setStatusEmail(t("incorrectData"));
        setIsSuccess(false);
      }
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendEmail({
      variables: {
        email: email,
      },
    });
  };

  return (
    <div className="standard-form">
      <Form onSubmit={handleSubmit}>
        <h1>{t("resetPassword")}</h1>
        <p>{t("enterEmailInstruction")}</p>
        <Form.Group controlId="email" size="lg">
          <Form.Label className="email">{t("email")}</Form.Label>
          <Form.Control
            autoFocus
            placeholder={t("email")}
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Button
          variant="outline-dark"
          className="button"
          type="submit"
          disabled={email === ""}
        >
          {t("send")}
        </Button>
        {statusEmail && (
          <p className={`text-${isSuccess ? "success" : "danger"}`}>
            {statusEmail}
          </p>
        )}
      </Form>
    </div>
  );
}
export default ResetPassword;

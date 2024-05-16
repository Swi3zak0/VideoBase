import React, { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logika obsługi formularza kontaktowego
    // Możesz tutaj dodać logikę wysyłania danych do serwera itp.
    setStatusMessage(t("messageSent"));
    setIsSuccess(true);
    resetFormFields();
  };

  const resetFormFields = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="change-form">
      <Form onSubmit={handleSubmit}>
        <h1>{t("contactUs")}</h1>
        <FormGroup controlId="name">
          <FormLabel>{t("name")}</FormLabel>
          <FormControl
            type="text"
            placeholder={t("enterName")}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="email">
          <FormLabel>{t("email")}</FormLabel>
          <FormControl
            type="email"
            placeholder={t("enterEmail")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="message">
          <FormLabel>{t("message")}</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            placeholder={t("enterMessage")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </FormGroup>
        <Button variant="dark" className="button" type="submit">
          {t("sendMessage")}
        </Button>
        {statusMessage && (
          <p className={`text-${isSuccess ? "success" : "danger"}`}>
            {statusMessage}
          </p>
        )}
      </Form>
    </div>
  );
}

export default ContactUs;

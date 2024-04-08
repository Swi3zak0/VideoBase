import { Button, Form, FormGroup, FormLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../CSS/Styles.css";

function Activated() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="form-container">
      <Form className="form">
        <FormGroup>
          <FormLabel>{t("accountConfirmed")}</FormLabel>
          <Button
            variant="dark"
            className="button"
            onClick={() => navigate("/login")}
          >
            {t("goToLogin")}
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
}
export default Activated;

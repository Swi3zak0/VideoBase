import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Search() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${search}`);
  };

  return (
    <Form className="Search" onSubmit={handleSubmit}>
      <Form.Control
        name="q"
        type="text"
        className="search-input"
        placeholder={t("searchPlaceholder")}
        onChange={(e) => setSearch(e.target.value)}
      ></Form.Control>
      <Button variant="outline-light" type="submit" disabled={search === ""}>
        {t("searchButton")}
      </Button>
    </Form>
  );
}

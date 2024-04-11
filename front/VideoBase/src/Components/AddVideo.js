import "../CSS/Styles.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import video from "../Images/video.jpg";
import { useTranslation } from "react-i18next";

function AddVideo() {
  const filename = localStorage.getItem("fileName");
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileStatus, setFileStatus] = useState("");
  const { t } = useTranslation();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.file[0]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form.Label>"filename"</Form.Label>
          <Card>
            <Card.Img src={video} />
          </Card>
        </Col>
        <Col>
          <Form>
            <h1>{t("videoInfo")}</h1>
            <Form.Group>
              <Form.Label>{t("titleRequired")}</Form.Label>
              <Form.Control type="text" placeholder={t("enterTitle")} />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("description")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={t("enterDescription")}
              />
              <Form.Text className="text-muted">0/3000</Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("category")}</Form.Label>
              <Form.Control as="select" defaultValue="">
                <option value="">{t("chooseCategory")}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="videoTags">
              <Form.Label>{t("tags")}</Form.Label>
              <Form.Control type="text" placeholder="#cats, #dogs" />
            </Form.Group>

            <Button className="button" variant="dark" type="submit">
              {t("addButton")}
            </Button>
            <Button
              className="button"
              variant="dark"
              onClick={() => navigate("/uploadVideo")}
            >
              {t("backButton")}
            </Button>
            {fileStatus && <p className="danger">{fileStatus}</p>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
export default AddVideo;

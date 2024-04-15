import "../CSS/Styles.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMutation, gql } from "@apollo/client";

const POST_MUTATION = gql`
  mutation postMutation(
    $username: String!
    $title: String!
    $description: String!
    $url: String!
  ) {
    postMutation(
      username: $usrname
      title: $title
      description: $description
      url: $url
    ) {
      username
      title
      description
      url
    }
  }
`;

function AddVideo() {
  const filename = localStorage.getItem("fileName");
  const [postStatus, setPostStatus] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const username = localStorage.getItem("username");

  const [post] = useMutation(POST_MUTATION, {
    onCompleted: (data) => {
      if (data.postMutation.success) {
        setPostStatus("Film zostal dodany");
      } else {
        setPostStatus("Błąd dodawania filmiku!");
      }
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await post({
      variables: {
        username: username,
        title: title,
        description: description,
        url: videoUrl,
      },
    });
  };

  return (
    <Container fluid onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <br />
          <Form.Label>{filename}</Form.Label>
          <Card>
            <video src={videoUrl} style={{ width: "100%", height: "auto" }} />
          </Card>
        </Col>
        <Col md={5} className="col">
          <Form>
            <h1>{t("videoInfo")}</h1>
            <Form.Group>
              <Form.Label>{t("titleRequired")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("enterTitle")}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("description")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={t("enterDescription")}
                onChange={(e) => setDescription(e.target.value)}
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
            {postStatus && <p>{postStatus}</p>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
export default AddVideo;

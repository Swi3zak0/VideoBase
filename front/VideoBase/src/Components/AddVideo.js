import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  FormCheck,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMutation, gql } from "@apollo/client";

const POST_MUTATION = gql`
  mutation createPost(
    $title: String!
    $videoUrl: String!
    $description: String!
    $isPrivate: Boolean!
    $tags: String!
  ) {
    createPost(
      title: $title
      videoUrl: $videoUrl
      description: $description
      isPrivate: $isPrivate
      tags: $tags
    ) {
      errors
      success
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
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState("");

  const [createPost] = useMutation(POST_MUTATION, {
    onCompleted: (data) => {
      if (data.createPost.success) {
        setPostStatus("Film został dodany");
      } else {
        setPostStatus("Błąd dodawania filmiku");
      }
    },
    onError: (error) => {
      setPostStatus("Błąd dodawania filmiku: ");
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createPost({
        variables: {
          title: title,
          description: description,
          videoUrl: videoUrl,
          isPrivate: isPrivate,
          tags: tags,
        },
      });
    } catch (error) {
      setPostStatus("Błąd dodawania filmiku");
    }
  };
  console.log({
    title: title,
    description: description,
    videoUrl: videoUrl,
    isPrivate: isPrivate,
    tags: tags,
  });

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <br />

          <Card>
            <video src={videoUrl} style={{ width: "100%", height: "auto" }} />
          </Card>
          <Form.Label className="filename-form-label">
            File: {filename}
          </Form.Label>
        </Col>
        <Col md={5} className="col standard-form">
          <Form onSubmit={handleSubmit}>
            <h1>{t("videoInfo")}</h1>
            <Form.Group>
              <Form.Label>{t("titleRequired")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("enterTitle")}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("description")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={t("enterDescription")}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <Form.Text className="text-muted">0/3000</Form.Text>
            </Form.Group>

            <Form.Group controlId="videoTags">
              <Form.Label>{t("tags")}</Form.Label>
              <Form.Control
                type="text"
                placeholder="#cats, #dogs"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
            </Form.Group>

            <Form.Group>
              <FormCheck
                type="checkbox"
                id="check"
                label="Private"
                onChange={(e) => {
                  console.log("Checkbox value: ", e.target.checked);
                  setIsPrivate(e.target.checked);
                }}
                checked={isPrivate}
              />
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

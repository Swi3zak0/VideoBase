import { Button, Form } from "react-bootstrap";
import "../CSS/Styles.css";
import { useNavigate } from "react-router-dom";

function AddVideo() {
  const filename = localStorage.getItem("fileName");
  const navigate = useNavigate();

  return (
    <div className="standard-form">
      <Form>
        <h1>
          <Button
            className="button"
            variant="outline-light"
            onClick={() => navigate("/uploadVideo")}
          >
            Back
          </Button>
          Video
        </h1>

        <Form.Group className="mb-3">
          <Form.Label>{filename}</Form.Label>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title - Required</Form.Label>
          <Form.Control type="text" placeholder="Enter title" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter a description"
          />
          <Form.Text className="text-muted">0/3000</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" defaultValue="">
            <option value="">Choose...</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="videoTags">
          <Form.Label>Tags</Form.Label>
          <Form.Control type="text" placeholder="#cats, #dogs" />
        </Form.Group>

        <Button className="button" variant="dark" type="submit">
          Add
        </Button>
      </Form>
    </div>
  );
}
export default AddVideo;

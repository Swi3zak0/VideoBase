import {
  Card,
  Col,
  Container,
  Row,
  CardHeader,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaRegCommentDots, FaEye } from "react-icons/fa";
import { useState } from "react";

function VideoPost() {
  const { id } = useParams();
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) {
      setDisliked(false);
    }
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) {
      setLiked(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardHeader>Osoba Dodająca</CardHeader>
            <Card.Body>
              <Card.Title>title</Card.Title>
              <video
                className="video"
                src={videoUrl}
                alt="wideo"
                controls="controls"
                style={{ width: "100%" }}
              />{" "}
            </Card.Body>
            <div>
              <ButtonGroup className="m-2">
                <Button onClick={handleLike} variant="light">
                  <BiSolidLike style={{ color: liked ? "green" : "#000000" }} />
                  10
                </Button>
                <br />
                <Button variant="light" onClick={handleDislike}>
                  <BiSolidDislike
                    style={{ color: disliked ? "red" : "#000000" }}
                  />
                  2
                </Button>
              </ButtonGroup>
              <Button variant="light">
                Comment <FaRegCommentDots />
              </Button>
              <div className="views-count">
                <FaEye /> 12
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default VideoPost;

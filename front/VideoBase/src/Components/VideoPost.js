import {
  Card,
  Col,
  Container,
  Row,
  CardHeader,
  ButtonGroup,
  Button,
  CardText,
} from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaRegCommentDots, FaEye } from "react-icons/fa";
import { useState } from "react";

function VideoPost() {
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const videoTitle = location.state?.videoTitle;
  const username = location.state?.uploaderName;
  const videoDescription = location.state?.videoDescription;
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
    <Container fluid>
      <Row>
        <Col md={7}>
          <Card>
            <CardHeader>{username}</CardHeader>
            <Card.Body>
              <Card.Title>{videoTitle}</Card.Title>
              <video
                className="video"
                src={videoUrl}
                alt="wideo"
                controls="controls"
                style={{ width: "100%" }}
              />{" "}
              <CardText>{videoDescription}</CardText>
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
        <Col md={{ span: 3, offset: 1 }}>
          <Card>
            <CardHeader>Recomended</CardHeader>
            <CardText>recomended</CardText>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default VideoPost;

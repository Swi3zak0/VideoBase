import React, { useState, useEffect } from "react";
import { FaRegCommentDots, FaEye } from "react-icons/fa";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import "../CSS/Styles.css";
import {
  CardHeader,
  Container,
  ListGroup,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
} from "react-bootstrap";

const POST_QUERY = gql`
  query MyQuery {
    allPosts {
      shortUrl
      title
      user {
        username
      }
      video {
        id
      }
    }
  }
`;

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data } = useQuery(POST_QUERY);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const successMsg = searchParams.get("success_message");
    const errorMsg = searchParams.get("error_message");

    if (successMsg) {
      setSuccessMessage(successMsg);
      const successTimeoutId = setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
      return () => clearTimeout(successTimeoutId);
    } else if (errorMsg) {
      setErrorMessage(errorMsg);
      const errorTimeoutId = setTimeout(() => {
        setErrorMessage("");
      }, 10000);
      return () => clearTimeout(errorTimeoutId);
    }
  }, [location.search]);

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

  const redirectToVideo = (video) => {
    navigate(`/video/${video.id}`, { state: { videoUrl: video.url } });
  };

  return (
    <Container fluid>
      <div>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
      <Row>
        <Col md={2}>
          <Card>
            <Card.Header>Popular</Card.Header>
            <ListGroup>
              <ListGroup.Item>Maciek</ListGroup.Item>
              <ListGroup.Item>Patryk</ListGroup.Item>
              <ListGroup.Item>Michał</ListGroup.Item>
              <ListGroup.Item>Arek</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={5} className="offset-md-1">
          {data &&
            data.allPosts &&
            data.allPosts
              .slice()
              .reverse()
              .map((post, index) => (
                <Card
                  key={index}
                  className="mb-4"
                  onClick={() => redirectToVideo(post)}
                >
                  <CardHeader>
                    {post.user ? post.user.username : "Nieznany użytkownik"}
                  </CardHeader>
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <video
                      className="video"
                      src={post.shortUrl}
                      alt="wideo"
                      controls="controls"
                      style={{ width: "100%" }}
                    />{" "}
                  </Card.Body>
                  <div>
                    <ButtonGroup className="m-2">
                      <Button onClick={handleLike} variant="light">
                        <BiSolidLike
                          style={{ color: liked ? "green" : "#000000" }}
                        />
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
              ))}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

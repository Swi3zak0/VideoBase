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
  CardText,
} from "react-bootstrap";

const POST_QUERY = gql`
  query MyQuery {
    allPosts {
      shortUrl
      title
      description
      user {
        username
      }
      video {
        id
        url
      }
    }
    allUsers {
      username
    }
  }
`;

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data } = useQuery(POST_QUERY);
  const [postInteractions, setPostInteractions] = useState({});

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
    if (data && data.allPosts) {
      const initialInteractions = data.allPosts.reduce((acc, post) => {
        acc[post.video.id] = { liked: false, disliked: false, views: 0 };
        return acc;
      }, {});
      setPostInteractions(initialInteractions);
    }
  }, [data, location.search]);

  const handleLike = (postId) => {
    setPostInteractions((currentInteractions) => ({
      ...currentInteractions,
      [postId]: {
        ...currentInteractions[postId],
        liked: !currentInteractions[postId].liked,
        disliked: false,
      },
    }));
  };

  const handleDislike = (postId) => {
    setPostInteractions((currentInteractions) => ({
      ...currentInteractions,
      [postId]: {
        ...currentInteractions[postId],
        disliked: !currentInteractions[postId].disliked,
        liked: false,
      },
    }));
  };

  const redirectToVideo = (post, event) => {
    event.preventDefault();
    navigate(`/video/${post.video.id}`, {
      state: {
        videoUrl: post.video.url,
        videoTitle: post.title,
        videoDescription: post.description,
        uploaderName: post.user
          ? post.user.username
          : "Niezalogowany użytkownik",
      },
    });
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
            {data &&
              data.allUsers &&
              data.allUsers.map((user, index) => (
                <ListGroup key={index}>
                  <ListGroup.Item>{user.username}</ListGroup.Item>
                </ListGroup>
              ))}
          </Card>
        </Col>
        <Col md={5} className="offset-md-1">
          {data &&
            data.allPosts &&
            data.allPosts
              .slice()
              .reverse()
              .map((post) => (
                <Card key={post.video.id} className="mb-4">
                  <CardHeader>
                    {post.user ? post.user.username : "Nieznany użytkownik"}
                  </CardHeader>
                  <Card.Body onClick={(e) => redirectToVideo(post, e)}>
                    <Card.Title>{post.title}</Card.Title>
                    <div>
                      <video
                        className="video"
                        src={post.shortUrl}
                        alt="wideo"
                        controls="controls"
                        style={{ width: "100%" }}
                      />{" "}
                    </div>
                    <CardText>{post.description}</CardText>
                  </Card.Body>
                  <div>
                    <ButtonGroup className="m-2">
                      <Button
                        onClick={() => handleLike(post.video.id)}
                        variant="light"
                      >
                        <BiSolidLike
                          style={{
                            color: postInteractions[post.video.id]?.liked
                              ? "green"
                              : "#000000",
                          }}
                        />
                        10
                      </Button>
                      <br />
                      <Button
                        onClick={() => handleDislike(post.video.id)}
                        variant="light"
                      >
                        <BiSolidDislike
                          style={{
                            color: postInteractions[post.video.id]?.disliked
                              ? "red"
                              : "#000000",
                          }}
                        />
                        2
                      </Button>
                    </ButtonGroup>
                    <Button
                      variant="light"
                      onClick={(e) => redirectToVideo(post, e)}
                    >
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

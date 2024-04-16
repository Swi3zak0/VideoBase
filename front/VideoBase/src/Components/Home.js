import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
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
import { FaRegCommentDots, FaEye, FaLeaf } from "react-icons/fa";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

const POST_QUERY = gql`
  query MyQuery {
    allPosts {
      dislikesCount
      likesCount
      shortUrl
      title
      id
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

const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      likes
      dislikes
      success
    }
  }
`;

const DISLIKE_POST = gql`
  mutation DislikePost($postId: ID!) {
    dislikePost(postId: $postId) {
      success
      likes
      dislikes
    }
  }
`;

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data, refetch } = useQuery(POST_QUERY);
  const [postInteractions, setPostInteractions] = useState({});

  const [likePost] = useMutation(LIKE_POST);
  const [dislikePost] = useMutation(DISLIKE_POST);

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
        acc[post.id] = {
          liked: false,
          disliked: false,
          likes: post.likesCount,
          dislikes: post.dislikeCount,
        };
        return acc;
      }, {});
      setPostInteractions(initialInteractions);
    }
  }, [data, location.search]);

  const handleLike = (postId) => {
    const post = postInteractions[postId];
    const currentlyLiked = post.liked;
    const newLikesCount = currentlyLiked ? post.likes - 1 : post.likes + 1;

    likePost({ variables: { postId } })
      .then((response) => {
        if (response.data.likePost.success) {
          setPostInteractions((current) => ({
            ...current,
            [postId]: {
              ...current[postId],
              liked: !currentlyLiked,
              disliked: false,
              dislikes: response.data.likePost.dislikes,
              likes: newLikesCount,
            },
          }));
        }
      })
      .catch((error) => console.error("Error processing like:", error));
  };

  const handleDislike = (postId) => {
    const post = postInteractions[postId];
    const currentlyDisliked = post.disliked;
    const newDislikesCount = currentlyDisliked
      ? post.dislikes - 1
      : post.dislikes + 1;

    dislikePost({ variables: { postId } })
      .then((response) => {
        if (response.data.dislikePost.success) {
          setPostInteractions((current) => ({
            ...current,
            [postId]: {
              ...current[postId],
              disliked: !currentlyDisliked,
              liked: false,
              likes: response.data.dislikePost.likes,
              dislikes: newDislikesCount,
            },
          }));
        }
      })
      .catch((error) => console.error("Error processing dislike:", error));
  };

  const redirectToVideo = (post, event) => {
    event.preventDefault();
    navigate(`/video/${post.id}`, {
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
                <Card key={post.id} className="mb-4">
                  <CardHeader>
                    {post.user ? post.user.username : "Nieznany użytkownik"}
                  </CardHeader>
                  <Card.Body
                    className="cursor-pointer"
                    onClick={(e) => redirectToVideo(post, e)}
                  >
                    <Card.Title>{post.title}</Card.Title>
                    <div>
                      <video
                        className="video"
                        src={post.shortUrl}
                        alt="wideo"
                        controls
                        style={{ width: "100%" }}
                      />
                    </div>
                    <CardText>{post.description}</CardText>
                  </Card.Body>
                  <div>
                    <ButtonGroup className="m-2">
                      <Button
                        onClick={() => handleLike(post.id)}
                        variant="light"
                      >
                        <BiSolidLike
                          style={{
                            color: postInteractions[post.id]?.liked
                              ? "green"
                              : "#000000",
                          }}
                        />{" "}
                        {postInteractions[post.id]?.likes || 0}
                      </Button>
                      <Button
                        onClick={() => handleDislike(post.id)}
                        variant="light"
                      >
                        <BiSolidDislike
                          style={{
                            color: postInteractions[post.id]?.disliked
                              ? "red"
                              : "#000000",
                          }}
                        />{" "}
                        {postInteractions[post.id]?.dislikes || 0}
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

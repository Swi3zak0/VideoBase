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
import { FaRegCommentDots, FaEye } from "react-icons/fa";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { IoIosStarOutline } from "react-icons/io";

const POST_QUERY = gql`
  query MyQuery {
    allPosts {
      isLiked
      isDisliked
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
      success
    }
  }
`;

const DISLIKE_POST = gql`
  mutation DislikePost($postId: ID!) {
    dislikePost(postId: $postId) {
      success
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
  const isLoggedIn = localStorage.getItem("isLoggedIn");

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
          liked: post.isLiked,
          disliked: post.isDisliked,
          likes: post.likesCount,
          dislikes: post.dislikesCount,
        };
        return acc;
      }, {});
      setPostInteractions(initialInteractions);
    }
  }, [data, location.search]);

  const handleLike = (postId) => {
    likePost({ variables: { postId } })
      .then((response) => {
        if (response.data.likePost.success) {
          refetch();
        }
      })
      .catch((error) => console.error("Error processing like:", error));
  };

  const handleDislike = (postId) => {
    dislikePost({ variables: { postId } })
      .then((response) => {
        if (response.data.dislikePost.success) {
          refetch();
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
        likes: post.isLiked,
        disLikes: post.isDisliked,
        postId: post.id,
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
          <div className="sticky-card">
            <Card.Header>
              Popular
              <IoIosStarOutline />
            </Card.Header>
            {data &&
              data.allUsers &&
              data.allUsers.map((user, index) => (
                <ListGroup key={index}>
                  <ListGroup.Item>{user.username}</ListGroup.Item>
                </ListGroup>
              ))}
          </div>
        </Col>
        <Col md={6} className="offset-md-1">
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
                    <CardText>
                      {post.description} {post.id}
                    </CardText>
                  </Card.Body>
                  <div>
                    <ButtonGroup className="m-2">
                      <Button
                        onClick={() => handleLike(post.id)}
                        variant="light"
                        title={
                          !isLoggedIn
                            ? "Zaloguj się, aby polubić"
                            : "Polub ten post"
                        }
                      >
                        <BiSolidLike
                          style={{
                            color: postInteractions[post.id]?.liked
                              ? "green"
                              : "#000000",
                          }}
                        />
                        {post.likesCount || 0}
                      </Button>
                      <Button
                        onClick={() => handleDislike(post.id)}
                        variant="light"
                        title={
                          !isLoggedIn
                            ? "Zaloguj się, aby niepolubić"
                            : "Niepolub ten post"
                        }
                      >
                        <BiSolidDislike
                          style={{
                            color: postInteractions[post.id]?.disliked
                              ? "red"
                              : "#000000",
                          }}
                        />
                        {post.dislikesCount || 0}
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

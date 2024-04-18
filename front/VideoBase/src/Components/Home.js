import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import debounce from "lodash.debounce";
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
  const { data } = useQuery(POST_QUERY);
  const [postInteractions, setPostInteractions] = useState({});

  const [likePost] = useMutation(LIKE_POST, {
    update(cache, { data: { likePost } }) {
      if (likePost.success) {
        const existingPost = cache.readQuery({
          query: POST_QUERY,
          variables: { postId: likePost.postId },
        });

        const updatedPosts = existingPost.allPosts.map((post) => {
          if (post.id === likePost.postId) {
            return {
              ...post,
              likesCount: likePost.likes,
              isLiked: true,
              isDisliked: false,
            };
          } else {
            return post;
          }
        });

        cache.writeQuery({
          query: POST_QUERY,
          data: { allPosts: updatedPosts },
        });
      }
    },
  });

  const [dislikePost] = useMutation(DISLIKE_POST, {
    update(cache, { data: { dislikePost } }) {
      if (dislikePost.success) {
        const existingPost = cache.readQuery({
          query: POST_QUERY,
          variables: { postId: dislikePost.postId },
        });

        const updatedPosts = existingPost.allPosts.map((post) => {
          if (post.id === dislikePost.postId) {
            return {
              ...post,
              dislikesCount: dislikePost.dislikes,
              isDisliked: true,
              isLiked: false,
            };
          } else {
            return post;
          }
        });

        cache.writeQuery({
          query: POST_QUERY,
          data: { allPosts: updatedPosts },
        });
      }
    },
  });

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

  const handleLike = useCallback(
    debounce((postId) => {
      setPostInteractions((currentInteractions) => {
        if (!currentInteractions[postId]) {
          return currentInteractions;
        }

        const updatedLikes = currentInteractions[postId].liked
          ? currentInteractions[postId].likes - 1
          : currentInteractions[postId].likes + 1;
        const updatedDislikes = currentInteractions[postId].disliked
          ? currentInteractions[postId].dislikes - 1
          : currentInteractions[postId].dislikes;

        likePost({
          variables: { postId },
          optimisticResponse: {
            __typename: "Mutation",
            likePost: {
              __typename: "LikePostResponse",
              likes: updatedLikes,
              dislikes: updatedDislikes,
              success: true,
              postId: postId,
            },
          },
        }).catch(() => {
          setPostInteractions((current) => {
            if (!current[postId]) return current;

            return {
              ...current,
              [postId]: {
                ...current[postId],
                liked: current[postId].liked,
                dislikes: current[postId].disliked
                  ? current[postId].dislikes + 1
                  : current[postId].dislikes - 1,
                likes: current[postId].liked
                  ? current[postId].likes + 1
                  : current[postId].likes - 1,
              },
            };
          });
        });
        return {
          ...currentInteractions,
          [postId]: {
            ...currentInteractions[postId],
            liked: !currentInteractions[postId].liked,
            disliked: false,
            likes: updatedLikes,
            dislikes: updatedDislikes,
          },
        };
      });
    }, 500),
    [likePost]
  );

  const handleDislike = useCallback(
    debounce((postId) => {
      setPostInteractions((currentInteractions) => {
        if (!currentInteractions[postId]) {
          return currentInteractions;
        }

        const updatedLikes = currentInteractions[postId].liked
          ? currentInteractions[postId].likes - 1
          : currentInteractions[postId].likes;
        const updatedDislikes = currentInteractions[postId].disliked
          ? currentInteractions[postId].dislikes - 1
          : currentInteractions[postId].dislikes + 1;

        dislikePost({
          variables: { postId },
          optimisticResponse: {
            __typename: "Mutation",
            dislikePost: {
              __typename: "DislikePostResponse",
              dislikes: updatedDislikes,
              likes: updatedLikes,
              success: true,
              postId: postId,
            },
          },
        }).catch(() => {
          setPostInteractions((current) => {
            if (!current[postId]) return current;

            return {
              ...current,
              [postId]: {
                ...current[postId],
                disliked: current[postId].disliked,
                dislikes: current[postId].disliked
                  ? current[postId].dislikes - 1
                  : current[postId].dislikes + 1,
                likes: current[postId].liked
                  ? current[postId].likes + 1
                  : current[postId].likes - 1,
              },
            };
          });
        });
        return {
          ...currentInteractions,
          [postId]: {
            ...currentInteractions[postId],
            disliked: !currentInteractions[postId].disliked,
            liked: false,
            likes: updatedLikes,
            dislikes: updatedDislikes,
          },
        };
      });
    }, 500),
    [dislikePost]
  );

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
                    <CardText>
                      {post.description} {post.id}
                    </CardText>
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

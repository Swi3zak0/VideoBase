import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Dodano useNavigate
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Card,
  Col,
  Container,
  Row,
  CardHeader,
  ButtonGroup,
  Button,
  CardText,
  Form,
  FormGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { FaTurnDown } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useTranslation } from "react-i18next";

// Zapytania GraphQL
const COMMENT_QUERY = gql`
  query MyQuery($postId: ID!) {
    postComments(postId: $postId) {
      comment
      id
      user {
        username
        id
      }
    }
    postById(postId: $postId) {
      isDisliked
      isLiked
      likesCount
      dislikesCount
      views
    }
    allSubcomments(postId: $postId) {
      subComment
      id
      user {
        username
        id
      }
      comment {
        id
      }
    }
  }
`;

const RECOMMENDED_VIDEOS_QUERY = gql`
  query MyQuery($postId: ID!) {
    recommendedVideos(postId: $postId) {
      id
      title
      shortUrl
      user {
        username
      }
      video {
        id
        url
      }
    }
  }
`;

// Mutacje GraphQL
const COMMENT_MUTATION = gql`
  mutation MyMutation($comment: String!, $postId: ID!) {
    createComent(comment: $comment, postId: $postId) {
      errors
      success
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      success
      errors
    }
  }
`;

const DELETE_SUBCOMMENT_MUTATION = gql`
  mutation deleteSubcomment($subcommentId: ID!) {
    deleteSubcomment(subcommentId: $subcommentId) {
      success
      errors
    }
  }
`;

const SUBCOMMENT_MUTATION = gql`
  mutation MyMutation($commentId: ID!, $subComment: String!) {
    createSubcoment(commentId: $commentId, subComment: $subComment) {
      errors
      success
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

function VideoPost() {
  const location = useLocation();
  const navigate = useNavigate(); // Inicjalizacja useNavigate
  const videoUrl = location.state?.videoUrl;
  const videoTitle = location.state?.videoTitle;
  const username = location.state?.uploaderName;
  const videoDescription = location.state?.videoDescription;
  const postId = location.state?.postId;
  const userId = localStorage.getItem("userId");
  const currentUserId = userId;
  const { t } = useTranslation();

  // Zapytania GraphQL
  const { data, loading, refetch } = useQuery(COMMENT_QUERY, {
    variables: { postId: postId },
  });

  const { data: recommendedData, loading: recommendedLoading } = useQuery(
    RECOMMENDED_VIDEOS_QUERY,
    {
      variables: { postId: postId },
    }
  );

  // Mutacje GraphQL
  const [createComment] = useMutation(COMMENT_MUTATION, {
    update(cache, { data: { createComent } }) {
      const existingComments = cache.readQuery({
        query: COMMENT_QUERY,
        variables: { postId: postId },
      });
      const newComment = createComent;
      cache.writeQuery({
        query: COMMENT_QUERY,
        variables: { postId: postId },
        data: {
          postComments: [...existingComments.postComments, newComment],
        },
      });
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    update(cache, { data: { deleteComment } }) {
      if (deleteComment.success) {
        const existingComments = cache.readQuery({
          query: COMMENT_QUERY,
          variables: { postId: postId },
        });
        const updatedComments = existingComments.postComments.filter(
          (comment) => comment.id !== deleteComment.id
        );
        cache.writeQuery({
          query: COMMENT_QUERY,
          variables: { postId: postId },
          data: { postComments: updatedComments },
        });
      }
    },
  });

  const [deleteSubcomment] = useMutation(DELETE_SUBCOMMENT_MUTATION, {
    update(cache, { data: { deleteSubcomment } }) {
      if (deleteSubcomment.success) {
        const existingData = cache.readQuery({
          query: COMMENT_QUERY,
          variables: { postId: postId },
        });

        const updatedSubcomments = existingData.allSubcomments.filter(
          (subcomment) => subcomment.id !== deleteSubcomment.id
        );

        cache.writeQuery({
          query: COMMENT_QUERY,
          variables: { postId: postId },
          data: {
            ...existingData,
            allSubcomments: updatedSubcomments,
          },
        });
      }
    },
  });

  const handleDeleteSubcomment = async (subcommentId) => {
    try {
      console.log("Usuwanie subkomentarza o ID:", subcommentId);
      const { data } = await deleteSubcomment({
        variables: {
          subcommentId: subcommentId,
        },
      });

      if (data.deleteSubcomment.success) {
        refetch();
      } else {
        console.error("Błąd:", data.deleteSubcomment.errors);
      }
    } catch (error) {
      console.error("Błąd usuwania subkomentarza:", error);
    }
  };

  const [createSubcomment] = useMutation(SUBCOMMENT_MUTATION, {
    update(cache, { data: { createSubcoment } }) {
      const existingSubcomments = cache.readQuery({
        query: COMMENT_QUERY,
        variables: { postId: postId },
      });

      const newSubcomment = createSubcoment;
      cache.writeQuery({
        query: COMMENT_QUERY,
        variables: { postId: postId },
        data: {
          allSubcomments: [
            ...existingSubcomments.allSubcomments,
            newSubcomment,
          ],
        },
      });
    },
  });

  const [likePost] = useMutation(LIKE_POST, {
    update(cache) {
      const existingData = cache.readQuery({
        query: COMMENT_QUERY,
        variables: { postId },
      });

      const isLiked = existingData.postById.isLiked;
      const isDisliked = existingData.postById.isDisliked;

      cache.writeQuery({
        query: COMMENT_QUERY,
        variables: { postId },
        data: {
          ...existingData,
          postById: {
            ...existingData.postById,
            isLiked: !isLiked,
            likesCount: isLiked
              ? existingData.postById.likesCount - 1
              : existingData.postById.likesCount + 1,
            isDisliked: false,
            dislikesCount: isDisliked
              ? existingData.postById.dislikesCount - 1
              : existingData.postById.dislikesCount,
          },
        },
      });
    },
  });

  const [dislikePost] = useMutation(DISLIKE_POST, {
    update(cache) {
      const existingData = cache.readQuery({
        query: COMMENT_QUERY,
        variables: { postId },
      });

      const isLiked = existingData.postById.isLiked;
      const isDisliked = existingData.postById.isDisliked;

      cache.writeQuery({
        query: COMMENT_QUERY,
        variables: { postId },
        data: {
          ...existingData,
          postById: {
            ...existingData.postById,
            isDisliked: !isDisliked,
            dislikesCount: isDisliked
              ? existingData.postById.dislikesCount - 1
              : existingData.postById.dislikesCount + 1,
            isLiked: false,
            likesCount: isLiked
              ? existingData.postById.likesCount - 1
              : existingData.postById.likesCount,
          },
        },
      });
    },
  });

  const handleLike = async () => {
    await likePost({ variables: { postId } });
  };

  const handleDislike = async () => {
    await dislikePost({ variables: { postId } });
  };

  const [replyBox, setReplyBox] = useState({ open: false, commentId: null });
  const [checkReplaysBox, setCheckReplaysBox] = useState({
    open: false,
    commentId: null,
  });

  const [subComment, setSubcomment] = useState("");
  const [comment, setComment] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (!loading && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
  }, [loading, initialLoadComplete]);

  const handleCommentSubmit = async () => {
    if (comment.trim() !== "") {
      await createComment({
        variables: {
          comment: comment,
          postId: postId,
        },
      });
      setComment("");
    }
  };

  const handleSubcommentSubmit = async (commentId) => {
    if (subComment.trim() !== "") {
      await createSubcomment({
        variables: {
          commentId: commentId,
          subComment: subComment,
        },
      });
      setSubcomment("");
    }
  };

  const handleCheckReplaysClick = (commentId) => {
    setCheckReplaysBox((prev) => ({
      open: !(prev.open && prev.commentId === commentId),
      commentId: prev.commentId === commentId ? null : commentId,
    }));
  };

  const handleEditSubcomment = (subcommentId) => {
    // Logika do edycji subkomentarza
  };

  const renderCheckReplyBox = (commentId) => {
    if (checkReplaysBox.open && checkReplaysBox.commentId === commentId) {
      const relevantSubcomments = data.allSubcomments.filter(
        (subcomment) => subcomment.comment.id === commentId
      );

      if (relevantSubcomments.length === 0) {
        return (
          <div className="subcomment-card no-replies">{t("noComments")}</div>
        );
      }

      return (
        <div className="subcomments">
          {relevantSubcomments.map((subcomment) => (
            <div key={subcomment.id} className="subcomment-container">
              <div className="subcomment-card">
                <div className="subcomment-header">
                  <div className="replay-user">{subcomment.user.username}</div>
                  {subcomment.user.id === currentUserId && (
                    <Dropdown align="end" className="dropdown-menu-right">
                      <Dropdown.Toggle
                        variant="secondary"
                        className="dropdown-toggle"
                      >
                        <BsThreeDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleEditSubcomment(subcomment.id)}
                        >
                          {t("edit")}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDeleteSubcomment(subcomment.id)}
                        >
                          {t("delete")}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
                <div className="check-replay-box">{subcomment.subComment}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleReplyClick = (commentId) => {
    setReplyBox((prev) => ({
      open: !prev.open,
      commentId: commentId === prev.commentId ? null : commentId,
    }));
  };

  const renderReplyBox = (commentId) => {
    if (replyBox.open && replyBox.commentId === commentId) {
      return (
        <Form
          className="reply-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubcommentSubmit(commentId);
          }}
        >
          <FormGroup>
            <FormControl
              className="reply-control"
              value={subComment}
              onChange={(e) => setSubcomment(e.target.value)}
              placeholder={t("addReplyPlaceholder")}
            />
            <Button className="reply-button" variant="dark" type="submit">
              {t("addReplyButton")}
            </Button>
          </FormGroup>
        </Form>
      );
    }
    return null;
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment({
      variables: {
        commentId: commentId,
      },
    });
    refetch();
  };

  const redirectToVideo = (post, event) => {
    event.preventDefault();
    if (post.video && post.video.url) {
      navigate(`/video/${post.id}`, {
        state: {
          videoUrl: post.video.url,
          videoTitle: post.title,
          videoDescription: post.description,
          likes: post.isLiked,
          disLikes: post.isDisliked,
          postId: post.id,
          uploaderName: post.user ? post.user.username : t("unloggedUser"),
        },
      });
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
                className="video cursor-pointer"
                src={videoUrl}
                alt="video"
                controls="controls"
                style={{ width: "100%" }}
              />{" "}
              <CardText>{videoDescription}</CardText>
            </Card.Body>
            <div>
              <ButtonGroup className="m-2">
                <Button onClick={handleLike} variant="light">
                  <BiSolidLike
                    style={{
                      color: data?.postById?.isLiked ? "green" : "#000000",
                    }}
                  />
                  {data?.postById?.likesCount || 0}
                </Button>
                <Button onClick={handleDislike} variant="light">
                  <BiSolidDislike
                    style={{
                      color: data?.postById?.isDisliked ? "red" : "#000000",
                    }}
                  />
                  {data?.postById?.dislikesCount || 0}
                </Button>
              </ButtonGroup>
              <div className="views-count">
                <FaEye /> {data?.postById?.views || 0}
              </div>
              <Form className="comments-form">
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    className="mb-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t("addCommentPlaceholder")}
                  />
                  <Button onClick={handleCommentSubmit} variant="dark">
                    {t("addCommentButton")}
                  </Button>
                </Form.Group>
              </Form>
            </div>
            <div className="custom-card">
              <h3>{t("commentsSection")}</h3>
              {loading ? (
                <div>{t("loadingComments")}</div>
              ) : data && data.postComments.length > 0 ? (
                data.postComments.map((comment) => (
                  <div key={comment.id} className="comment-container">
                    <div className="comment-header">
                      <div className="comment-username">
                        {comment.user.username}
                      </div>
                      {comment.user.id === currentUserId && (
                        <Dropdown align="end" className="comment-menu">
                          <Dropdown.Toggle
                            variant="secondary"
                            className="dropdown-toggle"
                          >
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>{t("edit")}</Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              {t("delete")}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                    <div className="custom-card-text">{comment.comment}</div>
                    <div>
                      <ButtonGroup className="button-group">
                        <Button
                          onClick={() => handleReplyClick(comment.id)}
                          variant="outline-dark"
                        >
                          {t("reply")}
                        </Button>
                        <Button
                          onClick={() => handleCheckReplaysClick(comment.id)}
                          variant="outline-dark"
                        >
                          <MdOutlineQuestionAnswer /> <FaTurnDown />
                        </Button>
                      </ButtonGroup>
                    </div>
                    {renderReplyBox(comment.id)}
                    {renderCheckReplyBox(comment.id)}
                  </div>
                ))
              ) : (
                <div>{t("noComments")}</div>
              )}
            </div>
          </Card>
        </Col>
        <Col md={{ span: 3, offset: 2 }}>
          <Card>
            <CardHeader>{t("recommended")}</CardHeader>
            {recommendedLoading ? (
              <CardText>{t("loadingRecommendations")}</CardText>
            ) : (
              <div className="recommended-videos">
                {recommendedData?.recommendedVideos?.map((video) => (
                  <div
                    key={video.id}
                    className="recommended-video"
                    onClick={(e) => redirectToVideo(video, e)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="video-thumbnail">
                      <video
                        src={video.shortUrl}
                        alt={video.title}
                        controls
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="video-info">
                      <div className="video-title">{video.title}</div>
                      {video.user && (
                        <div className="video-user">{video.user.username}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VideoPost;

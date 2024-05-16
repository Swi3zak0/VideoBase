import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
} from "react-bootstrap";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { FaTurnDown } from "react-icons/fa6";

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
  mutation deleteSubcomment($subCommentId: ID!) {
    deleteSubcomment(subCommentId: $subCommentId) {
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
  const videoUrl = location.state?.videoUrl;
  const videoTitle = location.state?.videoTitle;
  const username = location.state?.uploaderName;
  const videoDescription = location.state?.videoDescription;
  const postId = location.state?.postId;
  const userId = localStorage.getItem("userId");
  const currentUserId = userId;

  const { data, loading, refetch } = useQuery(COMMENT_QUERY, {
    variables: { postId: postId },
  });

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
        const existingSubcomments = cache.readQuery({
          query: COMMENT_QUERY,
          variables: { postId: postId },
        });
        const updatedSubcomments = existingSubcomments.allSubcomments.filter(
          (subcomment) => subcomment.id !== deleteSubcomment.id
        );
        cache.writeQuery({
          query: COMMENT_QUERY,
          variables: { postId: postId },
          data: { allSubcomments: updatedSubcomments },
        });
      }
    },
  });

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

  const [likePost] = useMutation(LIKE_POST);
  const [dislikePost] = useMutation(DISLIKE_POST);

  const handleLike = async () => {
    await likePost({ variables: { postId } });
    refetch();
  };

  const handleDislike = async () => {
    await dislikePost({ variables: { postId } });
    refetch();
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

  const renderCheckReplyBox = (commentId) => {
    if (checkReplaysBox.open && checkReplaysBox.commentId === commentId) {
      const relevantSubcomments = data.allSubcomments.filter(
        (subcomment) => subcomment.comment.id === commentId
      );

      if (relevantSubcomments.length === 0) {
        return <div className="subcomment-card">Brak odpowiedzi</div>;
      }

      return (
        <div className="subcomments">
          {relevantSubcomments.map((subcomment) => (
            <div key={subcomment.id} className="subcomment-card">
              <div className="replay-user">{subcomment.user.username}</div>
              <div className="check-replay-box">{subcomment.subComment}</div>
              {subcomment.user.id === currentUserId && (
                <Button
                  onClick={() => handleDeleteSubcomment(subcomment.id)}
                  variant="outline-danger"
                >
                  Delete
                </Button>
              )}
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
          onSubmit={(e) => {
            e.preventDefault();
            handleSubcommentSubmit(commentId);
          }}
        >
          <FormGroup>
            <FormControl
              className="replay-control"
              value={subComment}
              onChange={(e) => setSubcomment(e.target.value)}
              placeholder="Add a reply..."
            />
            <Button variant="outline-dark" type="submit">
              Dodaj odpowiedź
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

  const handleDeleteSubcomment = async (subCommentId) => {
    await deleteSubcomment({
      variables: {
        subCommentId: subCommentId,
      },
    });
    refetch();
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
                alt="wideo"
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
                    placeholder="Dodaj komentarz..."
                  />
                  <Button onClick={handleCommentSubmit} variant="dark">
                    Dodaj komentarz
                  </Button>
                </Form.Group>
              </Form>
            </div>
            <div className="custom-card">
              <h3>Comments:</h3>
              {loading ? (
                <div>Loading comments...</div>
              ) : data && data.postComments.length > 0 ? (
                data.postComments.map((comment) => (
                  <div key={comment.id}>
                    <div className="custom-card-header">
                      {comment.user.username}
                    </div>
                    <div className="custom-card-text">{comment.comment}</div>
                    <div>
                      <ButtonGroup>
                        <Button
                          onClick={() => handleReplyClick(comment.id)}
                          variant="outline-dark"
                        >
                          Answer
                        </Button>
                        <Button
                          onClick={() => handleCheckReplaysClick(comment.id)}
                          variant="outline-dark"
                        >
                          <MdOutlineQuestionAnswer /> <FaTurnDown />
                        </Button>
                        {comment.user.id === currentUserId && (
                          <Button
                            onClick={() => handleDeleteComment(comment.id)}
                            variant="outline-danger"
                          >
                            Delete
                          </Button>
                        )}
                      </ButtonGroup>
                    </div>
                    {renderReplyBox(comment.id)}
                    {renderCheckReplyBox(comment.id)}
                  </div>
                ))
              ) : (
                <div>No comments</div>
              )}
            </div>
          </Card>
        </Col>
        <Col md={{ span: 3, offset: 2 }}>
          <Card>
            <CardHeader>recommended</CardHeader>
            <CardText>recommended</CardText>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default VideoPost;

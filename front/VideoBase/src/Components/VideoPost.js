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
import { useLocation } from "react-router-dom";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import usePostInteractions from "./PostInteractions";
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
    }
    allSubcomments(postId: $postId) {
      subComment
      id
      user {
        username
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
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
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

function VideoPost() {
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const videoTitle = location.state?.videoTitle;
  const username = location.state?.uploaderName;
  const videoDescription = location.state?.videoDescription;
  const postId = location.state?.postId;
  const userId = localStorage.getItem("userId");
  const currentUserId = userId;

  const [createSubcomment] = useMutation(SUBCOMMENT_MUTATION, {
    update(cache, { data: { createSubcoment } }) {
      const existingSubcomments = cache.readQuery({
        query: gql`
          query GetSubcomments($postId: ID!) {
            allSubcomments(postId: $postId) {
              subComment
              id
              user {
                username
              }
              comment {
                id
              }
            }
          }
        `,
        variables: { postId: postId },
      });

      const newSubcomment = createSubcoment;
      const updatedSubcomments = [
        ...existingSubcomments.allSubcomments,
        newSubcomment,
      ];

      cache.writeQuery({
        query: gql`
          query GetSubcomments($postId: ID!) {
            allSubcomments(postId: $postId) {
              subComment
              id
              user {
                username
              }
              comment {
                id
              }
            }
          }
        `,
        variables: { postId: postId },
        data: {
          allSubcomments: updatedSubcomments,
        },
      });
    },
  });

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

  const { handleLike, handleDislike } = usePostInteractions(refetch);
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
      open: !prev.open && commentId !== prev.commentId,
      commentId: commentId,
    }));
  };

  const renderCheckReplyBox = (commentId) => {
    if (checkReplaysBox.open && checkReplaysBox.commentId === commentId) {
      const relevantSubcomments = data.allSubcomments.filter(
        (subcomment) => subcomment.comment.id === commentId
      );
      return (
        <div className="subcomments">
          {relevantSubcomments.map((subcomment) => (
            <div key={subcomment.id} className="subcomment-card">
              <div className="replay-user">{subcomment.user.username}</div>
              <div className="check-replay-box">{subcomment.subComment}</div>
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
                <Button onClick={() => handleLike(postId)} variant="light">
                  <BiSolidLike
                    style={{
                      color: data?.postById?.isLiked ? "green" : "#000000",
                    }}
                  />
                  {data?.postById?.likesCount || 0}
                </Button>
                <Button onClick={() => handleDislike(postId)} variant="light">
                  <BiSolidDislike
                    style={{
                      color: data?.postById?.isDisliked ? "red" : "#000000",
                    }}
                  />
                  {data?.postById?.dislikesCount || 0}
                </Button>
              </ButtonGroup>
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

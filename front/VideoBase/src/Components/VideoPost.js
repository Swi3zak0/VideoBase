import {
  Card,
  Col,
  Container,
  Row,
  CardHeader,
  ButtonGroup,
  Button,
  CardText,
  FormLabel,
  FormText,
  Form,
} from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaRegCommentDots, FaEye } from "react-icons/fa";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const COMMENT_QUERY = gql`
  query MyQuery($postId: ID!) {
    postComments(postId: $postId) {
      comment
      id
      user {
        username
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

function VideoPost() {
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const videoTitle = location.state?.videoTitle;
  const username = location.state?.uploaderName;
  const videoDescription = location.state?.videoDescription;
  const likes = location.state?.likes;
  const dislikes = location.state?.dislikes;
  const postId = location.state?.postId;

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [replyBox, setReplyBox] = useState({ open: false, commentId: null });
  const [comment, setComment] = useState("");

  const { data } = useQuery(COMMENT_QUERY, {
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

  const handleReplyClick = (commentId) => {
    setReplyBox({ open: !replyBox.open, commentId });
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() !== "") {
      try {
        const response = await createComment({
          variables: {
            comment: comment,
            postId: postId,
          },
        });
        setComment("");
      } catch (error) {}
    }
  };

  const renderReplyBox = (commentId) => {
    if (replyBox.open && replyBox.commentId === commentId) {
      return (
        <div>
          <textarea
            className="comment-replay"
            placeholder="Dodaj odpowiedź..."
          ></textarea>
          <Button variant="light">Dodaj odpowiedź</Button>
        </div>
      );
    }
    return null;
  };

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

              <div className="views-count">
                <FaEye /> 12
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
              {data &&
                data.postComments.map((comment) => (
                  <div key={comment.id}>
                    <div className="custom-card-header">
                      {comment.user.username}
                    </div>
                    <div className="custom-card-text">{comment.comment}</div>
                    <div>
                      <ButtonGroup>
                        <Button onClick={handleLike} variant="light">
                          <BiSolidLike
                            style={{ color: liked ? "green" : "#000000" }}
                          />
                          10
                        </Button>
                        <Button variant="light" onClick={handleDislike}>
                          <BiSolidDislike
                            style={{ color: disliked ? "red" : "#000000" }}
                          />
                          2
                        </Button>
                        <Button
                          onClick={() => handleReplyClick(comment.id)}
                          variant="light"
                        >
                          Answer
                        </Button>
                      </ButtonGroup>
                    </div>
                    {renderReplyBox(comment.id)}
                  </div>
                ))}
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

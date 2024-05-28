import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import {
  CardHeader,
  Container,
  ListGroup,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { IoIosStarOutline } from "react-icons/io";
import avatar from "../Images/avatar.jpg";

const POST_QUERY = gql`
  query MyQuery {
    allNonPrivatePosts {
      isLiked
      isDisliked
      dislikesCount
      likesCount
      shortUrl
      title
      id
      description
      views
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
  // const avatar = localStorage.getItem("avatar");

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
            <Card.Header className="card-header">
              Popular
              <IoIosStarOutline />
            </Card.Header>
            {data &&
              data.allUsers &&
              data.allUsers.map((user, index) => (
                <ListGroup key={index}>
                  <ListGroup.Item className="list-group-item">
                    <img
                      className="avatar"
                      src={avatar}
                      width="40"
                      height="40"
                      alt="avatar"
                    />{" "}
                    {user.username}
                  </ListGroup.Item>
                </ListGroup>
              ))}
          </div>
        </Col>
        <Col md={10}>
          <Row>
            {data &&
              data.allNonPrivatePosts &&
              data.allNonPrivatePosts
                .slice()
                .reverse()
                .map((post) => (
                  <Col md={6} key={post.id}>
                    <Card className="mb-4">
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
                        {/* <CardText>{post.description}</CardText> */}
                      </Card.Body>
                      {/* <div className="d-flex justify-content-between align-items-center m-3">
                      <div className="d-flex align-items-center">
                        <BiSolidLike
                          style={{ color: "green", marginRight: "5px" }}
                        />
                        {post.likesCount}
                        <BiSolidDislike
                          style={{
                            color: "red",
                            marginLeft: "10px",
                            marginRight: "5px",
                          }}
                        />
                        {post.dislikesCount}
                      </div>
                      <div className="d-flex align-items-center">
                        <FaEye style={{ marginRight: "5px" }} /> {post.views}
                      </div>
                    </div> */}
                    </Card>
                  </Col>
                ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

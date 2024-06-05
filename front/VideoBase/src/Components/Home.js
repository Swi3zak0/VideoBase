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
  Form,
  Navbar,
  Nav,
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
  }
`;

const TAGS_QUERY = gql`
  query MyQuery {
    allTags {
      id
      name
    }
  }
`;

const POSTS_BY_TAG_QUERY = gql`
  query MyQuery($tag: String!) {
    postByTag(tag: $tag) {
      id
      shortUrl
      title
      views
      isLiked
      isDisliked
      dislikesCount
      likesCount
      description
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

const USERS_QUERY = gql`
  query MyQuery {
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
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("");

  const { data: postData, refetch: refetchPosts } = useQuery(
    selectedTag ? POSTS_BY_TAG_QUERY : POST_QUERY,
    {
      variables: selectedTag ? { tag: selectedTag } : {},
    }
  );

  const { data: usersData } = useQuery(USERS_QUERY);

  const { data: tagsData } = useQuery(TAGS_QUERY);

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

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    refetchPosts(selectedTag ? { tag: selectedTag } : {});
  };

  const handleTagClick = (tagName) => {
    if (tagName === "All") {
      setSelectedTag("");
      refetchPosts();
    } else {
      setSelectedTag(tagName);
      refetchPosts({ tag: tagName });
    }
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
      <Row>
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
          <Navbar className="tags">
            <Navbar.Brand className="tag-brand">Tagi</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link
                key="all"
                onClick={() => handleTagClick("All")}
                className={`tag ${selectedTag === "" ? "active-tag" : ""}`}
              >
                All
              </Nav.Link>
              {tagsData &&
                tagsData.allTags &&
                tagsData.allTags.map((tag) => (
                  <Nav.Link
                    key={tag.id}
                    onClick={() => handleTagClick(tag.name)}
                    className={`tag ${
                      selectedTag === tag.name ? "active-tag" : ""
                    }`}
                  >
                    {tag.name}
                  </Nav.Link>
                ))}
            </Nav>
          </Navbar>
          <Col md={2}>
            <div className="sticky-card">
              <Card.Header className="card-header">
                Popularne
                <IoIosStarOutline />
              </Card.Header>
              {usersData &&
                usersData.allUsers &&
                usersData.allUsers.map((user, index) => (
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
            <Card className="mb-3 sort-card">
              <Card.Header className="card-header">Sorted by:</Card.Header>
              <Card.Body>
                <Form.Select value={sortOrder} onChange={handleSortChange}>
                  <option value="newest">Najnowsze</option>
                  <option value="best">Najlepsze</option>
                  <option value="worst">Najgorsze</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <div className="row">
              {postData &&
                (postData.allNonPrivatePosts || postData.postByTag) &&
                (postData.allNonPrivatePosts || postData.postByTag).map(
                  (post) => (
                    <Col md={6} key={post.id}>
                      <Card className="mb-4">
                        <CardHeader>
                          {post.user
                            ? post.user.username
                            : "Nieznany użytkownik"}
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
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                )}
            </div>
          </Col>
        </Row>
      </Row>
    </Container>
  );
}

export default Home;

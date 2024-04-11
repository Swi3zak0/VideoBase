import React, { useState, useEffect } from "react";
import video from "../Images/video.jpg";
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
  Image,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const POST_QUERY = gql`
  query MyQuery {
    allVideos {
      url
    }
  }
`;

function Home() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data } = useQuery(POST_QUERY);

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
        <Col md={3}>
          <Card>
            <Card.Header>Popular</Card.Header>
            <ListGroup>
              <ListGroup.Item>Maciek</ListGroup.Item>
              <ListGroup.Item>Patryk</ListGroup.Item>
              <ListGroup.Item>Michał</ListGroup.Item>
              <ListGroup.Item>Arek</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={7}>
          {data &&
            data.allVideos &&
            data.allVideos.map((video, index) => (
              <Card key={index} className="mb-3">
                <CardHeader>Osoba Dodająca</CardHeader>
                <Card.Body>
                  <Card.Title>Tytuł</Card.Title>
                  <Image src={video.url} alt="Opis wideo" fluid />
                </Card.Body>
                <ButtonGroup className="m-2">
                  <Button variant="outline-primary">Like</Button>
                  <Button variant="outline-secondary">Comment</Button>
                  <Button variant="outline-dark">Share</Button>
                </ButtonGroup>
              </Card>
            ))}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

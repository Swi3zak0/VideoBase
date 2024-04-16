import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import {
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  CardText,
} from "react-bootstrap";
import styles from "../CSS/searchScreen.module.css";

const SEARCH_QUERY = gql`
  query SearchPosts($keywords: String!) {
    searchPost(search: $keywords) {
      shortUrl
      createTime
      title
      description
      user {
        username
      }
      video {
        id
      }
    }
  }
`;

function SearchScreen() {
  const { keywords } = useParams();

  const { data } = useQuery(SEARCH_QUERY, {
    variables: { keywords },
  });

  return (
    <Container fluid>
      {data &&
        data.searchPost &&
        data.searchPost.map((post) => (
          <div className={styles.customCard}>
            <Row
              key={post.video.id}
              className={`${styles.cardRow} mb-4 align-items-stretch`}
            >
              <Col md={3} lg={3} className="px-0">
                <Card key={post.video.id} className={`${styles.card} mb-4`}>
                  <video
                    className="video"
                    src={post.shortUrl}
                    alt="wideo"
                    controls="controls"
                    style={{ width: "100%" }}
                  />{" "}
                </Card>
              </Col>
              <Col md={3} lg={3} className="px-0">
                <Card className={`${styles.card} border-0`}>
                  <CardHeader>
                    {post.user ? post.user.username : "Nieznany użytkownik"}
                  </CardHeader>
                  <Card.Title className="mb-0">{post.title}</Card.Title>
                  <CardText className="mt-0">
                    {" "}
                    <small className="text-muted">{post.createTime}</small>
                  </CardText>
                </Card>
              </Col>
            </Row>
          </div>
        ))}
    </Container>
  );
}
export default SearchScreen;

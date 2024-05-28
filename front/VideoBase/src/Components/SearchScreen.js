import { useNavigate, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";

const SEARCH_QUERY = gql`
  query SearchPosts($keywords: String!) {
    searchPost(search: $keywords) {
      shortUrl
      createTime
      title
      description
      id
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

function SearchScreen() {
  const { keywords } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data } = useQuery(SEARCH_QUERY, {
    variables: { keywords },
  });

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
        uploaderName: post.user ? post.user.username : t("unloggedUser"),
      },
    });
  };

  if (!data || !data.searchPost || data.searchPost.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          margin: "50px",
          fontSize: "40px",
          borderBottom: "2px solid black",
        }}
      >
        {t("noVideosFound")} "{keywords}"
      </div>
    );
  }

  return (
    <div>
      {data &&
        data.searchPost &&
        data.searchPost.map((post) => (
          <div key={post.id} className="row mb-4 align-items-stretch">
            <div
              className="col-md-3 px-0 cursor-pointer"
              onClick={(e) => redirectToVideo(post, e)}
            >
              <div className="search-card mb-4">
                <video
                  className="video"
                  src={post.shortUrl}
                  alt="video"
                  controls
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="col-md-3 px-0">
              <div className="search-card border-0">
                <div className="custom-card-header">
                  <h2>{post.user ? post.user.username : t("unknownUser")}</h2>
                </div>
                <h5 className="custom-card-title mb-0">{post.title}</h5>
                <p className="custom-card-text mt-0">
                  <small className="text-muted">{post.createTime}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default SearchScreen;

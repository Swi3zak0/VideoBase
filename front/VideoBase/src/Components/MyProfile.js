import { useState } from "react";
import { NavLink, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import avatar from "../Images/avatar.jpg";
import { useQuery, useMutation, gql } from "@apollo/client";

const USER_VIDEOS_QUERY = gql`
  query MyQuery {
    videosAddedByUser {
      id
      shortUrl
      isPrivate
    }
    likedPostsByUser {
      id
      shortUrl
    }
  }
`;

const SET_VIDEO_PRIVATE_MUTATION = gql`
  mutation SetVideoPrivate($videoId: ID!, $isPrivate: Boolean!) {
    setVideoPrivate(videoId: $videoId, isPrivate: $isPrivate) {
      success
      message
    }
  }
`;

const DELETE_VIDEO_MUTATION = gql`
  mutation DeleteVideo($videoId: ID!) {
    deleteVideo(videoId: $videoId) {
      success
      message
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      success
    }
  }
`;

function MyProfile() {
  const navigate = useNavigate();
  const [view, setView] = useState("myLikes");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const { data, loading, error, refetch } = useQuery(USER_VIDEOS_QUERY);
  const [setVideoPrivate] = useMutation(SET_VIDEO_PRIVATE_MUTATION, {
    onCompleted: () => refetch(),
  });
  const [deleteVideo] = useMutation(DELETE_VIDEO_MUTATION, {
    onCompleted: () => refetch(),
  });
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    onCompleted: () => refetch(),
  });

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error.message}</p>;

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const redirectToVideo = (post, event) => {
    event.preventDefault();
    navigate(`/video/${post.id}`, {
      state: {
        videoUrl: post.shortUrl,
        videoTitle: post.title,
        videoDescription: post.description,
        likes: post.isLiked,
        disLikes: post.isDisliked,
        postId: post.id,
        uploaderName: username,
      },
    });
  };

  const handleSetPrivate = async (videoId, isPrivate) => {
    await setVideoPrivate({ variables: { videoId, isPrivate } });
  };

  const handleDelete = async (postId) => {
    await deletePost({ variables: { postId } });
  };

  return (
    <div className="row">
      <div className="user-profile">
        <div className="avatar">
          <img src={avatar} alt="avatar" />
        </div>
        <div className="user-info">
          <div className="username">{username}</div>
          <div className="email">@{email}</div>
        </div>
      </div>

      <div className="nav-tabs">
        <div onClick={() => handleViewChange("myLikes")}>
          <NavLink
            className={
              view === "myLikes" ? "profile-link active" : "profile-link"
            }
          >
            Polubione filmy
          </NavLink>
        </div>
        <div onClick={() => handleViewChange("myVideos")}>
          <NavLink
            className={
              view === "myVideos" ? "profile-link active" : "profile-link"
            }
          >
            Moje filmy
          </NavLink>
        </div>
      </div>
      <div className="content">
        {view === "myLikes" ? (
          <div>
            {data.likedPostsByUser.length === 0 ? (
              <div>Brak polubionych postów</div>
            ) : (
              data.likedPostsByUser.map((post) => (
                <div key={post.id} className="videos-container">
                  <video
                    className="video cursor-pointer"
                    onClick={(e) => redirectToVideo(post, e)}
                    src={post.shortUrl}
                    alt="wideo"
                    controls
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {data.videosAddedByUser.length === 0 ? (
              <div>Brak dodanych postów</div>
            ) : (
              data.videosAddedByUser.map((post) => (
                <div key={post.id} className="videos-container">
                  <video
                    className="video cursor-pointer"
                    onClick={(e) => redirectToVideo(post, e)}
                    src={post.shortUrl}
                    alt="wideo"
                    controls
                  />
                  <div className="video-actions">
                    <Form.Check
                      type="switch"
                      id={`custom-switch-${post.id}`}
                      label="Private"
                      checked={post.isPrivate}
                      onChange={() =>
                        handleSetPrivate(post.id, !post.isPrivate)
                      }
                    />
                    <button onClick={() => handleDelete(post.id)}>Usuń</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfile;

import React, { useState } from "react";
import { NavLink, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import avatar from "../Images/avatar.jpg";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";

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

const CHANGE_PRIVACY_MUTATION = gql`
  mutation ChangePrivacy($postId: ID!) {
    changePrivacy(postId: $postId) {
      success
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
  const { t } = useTranslation();

  const { data, loading, error, refetch } = useQuery(USER_VIDEOS_QUERY);
  const [changePrivacy] = useMutation(CHANGE_PRIVACY_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    onCompleted: () => refetch(),
  });

  if (loading) return <p>{t("loading")}</p>;
  if (error)
    return (
      <p>
        {t("error")} {error.message}
      </p>
    );

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

  const handleSetPrivate = async (videoId) => {
    try {
      const { data } = await changePrivacy({ variables: { postId: videoId } });
    } catch (error) {
      console.error("Error setting video privacy:", error);
    }
  };

  const handleDelete = async (postId) => {
    console.log("Deleting post:", postId);
    try {
      const { data } = await deletePost({ variables: { postId } });
      console.log("Response:", data);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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
            {t("likedVideos")}
          </NavLink>
        </div>
        <div onClick={() => handleViewChange("myVideos")}>
          <NavLink
            className={
              view === "myVideos" ? "profile-link active" : "profile-link"
            }
          >
            {t("addedVideos")}
          </NavLink>
        </div>
      </div>
      <div className="content">
        {view === "myLikes" ? (
          <div>
            {data.likedPostsByUser.length === 0 ? (
              <div>{t("noLikedPosts")}</div>
            ) : (
              data.likedPostsByUser.map((post) => (
                <div key={post.id} className="videos-container">
                  <video
                    className="video cursor-pointer"
                    onClick={(e) => redirectToVideo(post, e)}
                    src={post.shortUrl}
                    alt="video"
                    controls
                    style={{ width: "400px", height: "auto" }}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {data.videosAddedByUser.length === 0 ? (
              <div>{t("noAddedPosts")}</div>
            ) : (
              data.videosAddedByUser.map((post) => (
                <div key={post.id} className="videos-container">
                  <video
                    className="video cursor-pointer"
                    onClick={(e) => redirectToVideo(post, e)}
                    src={post.shortUrl}
                    alt="video"
                    controls
                    style={{ width: "400px", height: "auto" }}
                  />
                  <div className="video-actions">
                    <Form.Check
                      type="switch"
                      id={`custom-switch-${post.id}`}
                      label={t("private")}
                      checked={post.isPrivate}
                      onChange={() => handleSetPrivate(post.id)}
                    />
                    <button onClick={() => handleDelete(post.id)}>
                      {t("delete")}
                    </button>
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

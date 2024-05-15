import { useState } from "react";
import { Card, CardHeader, NavLink } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import avatar from "../Images/avatar.jpg";

function MyProfile() {
  const navigate = useNavigate();
  const [view, setView] = useState("myLikes");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const handleViewChange = (newView) => {
    setView(newView);
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
            <div>
              {/* dodac post to redirect  */}
              <div className="videos-container">
                <video
                  className="video cursor-pointer"
                  onClick={(e) => redirectToVideo(e)}
                  //   src={post.shortUrl}
                  alt="wideo"
                  controls
                />
              </div>
            </div>
          </div>
        ) : (
          <div>Wyświetlanie moich filmów</div>
        )}
      </div>
    </div>
  );
}
export default MyProfile;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cover from "../../img/cover.jpg";
import Profile from "../../img/profileImg.jpg";
import { fetchUserById } from "../../redux/userSlice";
import "./ProfileCard.css";
import { Link, useLocation } from "react-router-dom";

function ProfileCard({ path }) {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const location = useLocation();
  const [profiledata, setProfiledata] = useState(null);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserById(token));
    }
    if (location.state) {
      setProfiledata(location.state);
    }
  }, [user, location.state]);
  return (
    <div className="ProfileCard">
      {profiledata ? (
        <div className="ProfileImages">
          <img
            src={profiledata?.coverPic ? profiledata?.coverPic : Cover}
            alt="Cover Image"
          />
          <img
            src={profiledata?.profilePic ? profiledata?.profilePic : Profile}
            alt="Profile Image"
          />
        </div>
      ) : (
        <div className="ProfileImages">
          <img
            src={user?.coverPic ? user?.coverPic : Cover}
            alt="Cover Image"
          />
          <img
            src={user?.profilePic ? user?.profilePic : Profile}
            alt="Profile Image"
          />
        </div>
      )}

      {profiledata ? (
        <div className="ProfileName">
          <span>
            {profiledata?.fname} {profiledata?.lname}
          </span>
          <span>{profiledata?.username}</span>
        </div>
      ) : (
        <div className="ProfileName">
          <span>
            {user?.fname} {user?.lname}
          </span>
          <span>{user?.username}</span>
        </div>
      )}

      <div className="FollowStatus">
        <hr />
        {profiledata ? (
          <div>
            <div className="follow">
              <span>{profiledata?.following?.length}</span>
              <span>Following</span>
            </div>
            <div className="vl"></div>
            <div className="follow">
              <span>{profiledata?.followers?.length}</span>
              <span>Followers</span>
            </div>

            {path === "profilePage" && (
              <>
                <div className="vl"></div>
                <div className="follow">
                  <span>{profiledata?.posts?.length}</span>
                  <span>Posts</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="follow">
              <span>{user?.following?.length}</span>
              <span>Following</span>
            </div>
            <div className="vl"></div>
            <div className="follow">
              <span>{user?.followers?.length}</span>
              <span>Followers</span>
            </div>

            {path === "profilePage" && (
              <>
                <div className="vl"></div>
                <div className="follow">
                  <span>{user?.posts?.length}</span>
                  <span>Posts</span>
                </div>
              </>
            )}
          </div>
        )}
        <hr />
      </div>
      {path === "profilePage" ? (
        ""
      ) : (
        <Link
          to={`/profile/${user?.username}`}
          style={{
            alignSelf: "center",
            textDecoration: "none",
            background: "inherit",
            marginBottom: "1rem",
          }}
        >
          <span>My Profile</span>
        </Link>
      )}
    </div>
  );
}

export default ProfileCard;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cover from "../../img/cover.jpg";
import Profile from "../../img/profileImg.jpg";
import { fetchUserById } from "../../redux/userSlice";
import "./ProfileCard.css";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import { Link, useLocation } from "react-router-dom";
import { USER_API } from "../../axios";
import UsersModal from "../UsersModal/UsersModal";
import toast from 'react-hot-toast'

function ProfileCard({ path }) {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const location = useLocation();
  const [profiledata, setProfiledata] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(null);
  const [followerUsers, setFollowerUsers] = useState(null);
  const [usermodalOpened, setUserModalOpened] = useState(false);
  const [followerUsermodalOpened, setFollowerUserModalOpened] = useState(false);

  const getFollowingUsers = async (id) => {
    try {
      dispatch(showLoading());
      const response = await USER_API.get(`/${id}/following-users`);
      dispatch(hideLoading());
      if (response.status === 200) {
        console.log(response,'sadasdadasasa')
        setFollowingUsers(response.data.data);
        setUserModalOpened(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const getFollowerUsers = async (id) => {
    try {
      dispatch(showLoading());
      const response = await USER_API.get(`/${id}/follower-users`);
      dispatch(hideLoading());
      if (response.status === 200) {
        setFollowerUsers(response.data.data);
        setFollowerUserModalOpened(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserById(token));
    }
    if (location.state) {
      setProfiledata(location.state);
      dispatch(fetchUserById(token))
    } 
  }, [location.state]);
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
            <div
              className="follow"
              onClick={() => {
                getFollowingUsers(profiledata._id);
              }}
            >
              <span>{profiledata?.following?.length}</span>
              <span>Following</span>
            </div>
            <UsersModal
              usermodalOpened={usermodalOpened}
              setUserModalOpened={setUserModalOpened}
              data={followingUsers}
            />
            <div className="vl"></div>
            <div
              className="follow"
              onClick={() => {
                getFollowerUsers(profiledata._id);
              }}
            >
              <span>{profiledata?.followers?.length}</span>
              <span>Followers</span>
            </div>
            <UsersModal
              usermodalOpened={followerUsermodalOpened}
              setUserModalOpened={setFollowerUserModalOpened}
              data={followerUsers}
            />

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
            <div className="follow" onClick={() => getFollowingUsers(user._id)}>
              <span>{user?.following?.length}</span>
              <span>Following</span>
            </div>
            <UsersModal
              usermodalOpened={usermodalOpened}
              setUserModalOpened={setUserModalOpened}
              data={followingUsers}
            />
            <div className="vl"></div>
            <div
              className="follow"
              onClick={() => {
                getFollowerUsers(user._id);
              }}
            >
              <span>{user?.followers?.length}</span>
              <span>Followers</span>
            </div>
            <UsersModal
              usermodalOpened={followerUsermodalOpened}
              setUserModalOpened={setFollowerUserModalOpened}
              data={followerUsers}
            />

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

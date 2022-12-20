import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cover from "../../img/cover.jpg";
import Profile from "../../img/profileImg.jpg";
import { fetchUserById } from "../../redux/userSlice";
import "./ProfileCard.css";

function ProfileCard() {
  const token = localStorage.getItem("token");
  const {user} = useSelector((state) => state.users);
  const dispatch = useDispatch()
  useEffect(() => {
    if(!user){
      dispatch(fetchUserById(token));
    } 
  },[user]);
  const ProfilePage = false;
  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img src={Cover} alt="" />
        <img src={Profile} alt="" />
      </div>

      <div className="ProfileName">
        <span>{user?.fname} {user?.lname}</span>
        <span>{user?.username}</span>
      </div>

      <div className="FollowStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{user?.following?.length}</span>
            <span>Followings</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{user?.followers?.length}</span>
            <span>Followers</span>
          </div>

          {ProfilePage && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>3</span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>
      {ProfilePage ? "" : <span>My Profile</span>}
    </div>
  );
}

export default ProfileCard;

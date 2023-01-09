import React from "react";
import { Link } from "react-router-dom";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import "./SettingsLeft.css";

const SettingsLeft = ({setChangePass, setSavedPost}) => {
  return (
    <div className="SettingsLeft">
      <div className="navIcons">
        <Link to={"/home"}>
          <img src={Home} alt="" />
        </Link>
        <img src={Noti} alt="" />
        <Link to={"/settings"}>
          <UilSetting />
        </Link>
        <Link to={"/chat"}>
          <img src={Comment} alt="" />
        </Link>
      </div>
      <div className="option-container">
      <div className="options" onClick={()=>{
        setChangePass(false)
        setSavedPost(true)
      }}>
        <span><i className="ri-bookmark-line"></i></span>
        <span>Saved Posts</span>
      </div>
      <div className="options" onClick={() => {
        setSavedPost(false)
        setChangePass(true)
      }}>
        <span><i className="ri-settings-3-line"></i></span>
        <span>Change Password</span>
      </div>
      <div className="options">
        <span><i className="ri-delete-bin-6-line"></i></span>
        <span>Delete Account</span>
      </div>
      </div>
    </div>
  );
};

export default SettingsLeft;

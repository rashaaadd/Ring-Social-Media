import React from "react";
import "./RightSide.css";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import FollowersCard from "../FollowersCard/FollowersCard";
import { Link } from "react-router-dom";

function RightSide() {
  return (
    <div className="RightSide">
      <div className="navIcons">
        <Link to={"/home"}>
          <img src={Home} alt="" />
        </Link>
        <img src={Noti} alt="" />
        <Link to={'/settings'}>
          <UilSetting />
        </Link>
        <Link to={"/chat"}>
          <img src={Comment} alt="" />
        </Link>
      </div>

      <FollowersCard />
    </div>
  );
}

export default RightSide;

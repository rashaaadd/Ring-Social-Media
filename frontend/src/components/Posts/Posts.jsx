import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { POSTS_API } from "../../axios";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import Post from "../Post/Post";
import "./Posts.css";

function Posts({ data }) {
  const { posts, setPosts } = data;
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const location = useLocation();
  const [profilePosts, setProfilePosts] = useState(null);
  const [profiledata, setProfiledata] = useState(null);

  useEffect(() => {
    if (location.state) {
      setProfiledata(location.state);
      (async () => {
        try {
          dispatch(showLoading());
          const response = await POSTS_API.get(
            `/profile-posts/${profiledata?._id}`
          );
          if (response.data.status) {
            setProfilePosts(response.data.data);
          }
          dispatch(hideLoading());
        } catch (error) {
          dispatch(hideLoading());
          console.log(error);
          toast.error(error.response.data.message);
        }
      })();
    }else{
      (async () => {
        try {
          dispatch(showLoading());
          const response = await POSTS_API.get("/timeline");
          if (response.data.status) {
            setPosts(response.data.data);
          }
          dispatch(hideLoading());
        } catch (error) {
          dispatch(hideLoading());
          console.log(error);
          toast.error(error.response.data.message);
        }
      })();
    }
  }, [user, location.state]);
  return (
    <div className="Posts">
      {profilePosts ? (
        <>
          {profilePosts?.map((post, id) => {
            return <Post data={post} id={user?.id} key={post?._id} />;
          })}
        </>
      ) : (
        <>
          {posts?.map((post, id) => {
            return <Post data={post} id={user?.id} key={post?._id} />;
          })}
        </>
      )}
    </div>
  );
}

export default Posts;

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { POSTS_API } from "../../axios";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import Post from "../Post/Post";
import "./SavedPosts.css";

function SavedPosts() {
  const { user } = useSelector((state) => state.users);
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  console.log(user, "jsdnakjs11111");

  const getSavedPosts = async () => {
    try {
      dispatch(showLoading());
      const response = await POSTS_API.get(`/${user?._id}/saved-posts`);
      dispatch(hideLoading());
      if (response.data.status) {
        setPosts(response.data.data);
      } else {
        toast.error(response.data.message);
        console.log(response);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      getSavedPosts();
    }
  }, [user]);
  return (
    <div className="SavedPosts">
      {posts.length>0 ? (
        <>
          {posts.map((post, id) => {
            return <Post data={post} id={user?.id} key={post?._id} />;
          })}
        </>
      ) : (
        <h5 className="savedMessage mt-5">No saved posts</h5>
      )}
    </div>
  );
}

export default SavedPosts;

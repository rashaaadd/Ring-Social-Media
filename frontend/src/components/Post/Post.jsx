import React from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserById } from "../../redux/userSlice";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import { POSTS_API, USER_API_PUT } from "../../axios";
import { toast } from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditModal from "../EditModal/EditModal";
import CommentModal from "../CommentModal.js/CommentModal";
import moment from "moment";

function Post({ data, id }) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [postDetails, setPostDetails] = useState(data)
  const { user } = useSelector((state) => state.users);
  const [liked, setLiked] = useState(data?.likes?.includes(user?._id));
  const [likes, setLikes] = useState(data?.likes?.length);
  const [editmodalOpened, setEditModalOpened] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const handleComment = async (id) => {
    try {
      dispatch(showLoading());
      const response = await POSTS_API.get(`/${id}/comments`);
      dispatch(hideLoading());
      if (response.data.status) {
        setComments(response.data.data);
        setCommentModalOpen(true);
      } else {
        console.log(response, "Error");
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleLike = async (id) => {
    try {
      setLiked((prev) => !prev);
      dispatch(showLoading());
      const response = await POSTS_API.put(`/${id}/like`);
      dispatch(hideLoading());
      if (response.data.status) {
        liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
      fetchUserById(token);
  }, [token]);

  let options;
  console.log(user._id,'......',data.userId._id)
  if(user?._id === data.userId._id){
    options = ["Edit", "Delete"];
  }else{
    options = ["Report", "Save"];
  }

  const ITEM_HEIGHT = 30;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = async (option, postId) => {
    switch (option) {
      case "Delete":
        try {
          dispatch(showLoading());
          const response = await POSTS_API.delete(`/${postId}`);
          console.log(response, "response of deleting a post");
          dispatch(hideLoading());
          if (response.status) {
            toast.success(response.data.message);
            document.getElementById(postId).style.display = "none";
            setAnchorEl(null);
            dispatch(fetchUserById(token));
            break;
          } else {
            console.log("11111111");
            toast.error(response.response.data.message);
            break;
          }
        } catch (error) {
          console.log("hiii");
          dispatch(hideLoading());
          console.log(error);
          toast.error(error.response.data.message);
          break;
        }
      case "Edit":
        try {
          setEditModalOpened(true);
          setAnchorEl(null);
          dispatch(fetchUserById(token));
          break;
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
          break;
        }
      case "Save":
        try {
          dispatch(showLoading())
          const response = await USER_API_PUT(`/${postId}/save`)
          dispatch(hideLoading())
          if(response.data.status){
            toast.success(response.data.message);
            setAnchorEl(null);
            break;
          }else{
            toast.error(response.data.message)
            console.log(response)
            break;
          }
        } catch (error) {
          console.log(error)
          toast.error(error.response.data.message)
          break;
        }
      default:
        break;
    }
  };
  return (
    <div className="Post" key={postDetails?._id} id={postDetails?._id}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "small-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "12ch",
            left: "2ch",
          },
        }}
      >
        {options.map((option,id) => (
            <MenuItem
            key={id}
            onClick={() => handleMenuClick(option, postDetails?._id)}
            style={{ fontSize: "0.8rem", fontFamily: "Montserrat" }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <EditModal
        editmodalOpened={editmodalOpened}
        setEditModalOpened={setEditModalOpened}
        postDetails={postDetails}
        setPostDetails={setPostDetails}
      />

      <img src={postDetails?.images} alt="PostImage" />

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={
            liked
              ? { width: "25px", height: "25px", cursor: "pointer" }
              : { width: "25px", height: "20px", cursor: "pointer" }
          }
          onClick={() => handleLike(postDetails?._id)}
        />
        <img
          src={Comment}
          alt=""
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
          onClick={() => handleComment(postDetails?._id)}
        />

        <img
          src={Share}
          alt=""
          style={{ width: "21px", height: "21px", cursor: "pointer" }}
        />
      </div>

      <span style={{ color: "var(--gray) ", fontSize: "13px" }}>
        {likes ? likes : 0} likes
      </span>
      <div className="details">
        <span>
          <b>{postDetails?.userId?.username} </b>
        </span>
        <span> {postDetails?.desc}</span>
      </div>
      <CommentModal
        comments={comments}
        setComments={setComments}
        commentModalOpen={commentModalOpen}
        setCommentModalOpen={setCommentModalOpen}
        data={postDetails}
      />
      <div>
        {postDetails?.comments?.length > 0 ? (
          postDetails?.comments.slice(0, 2).map((comment, id) => {
            return (
                <div
                  className="details"
                  key = {id}
                  style={{ fontSize: "13px", marginTop:'-15px',lineHeight:2.5 }}
                >
                  <span>
                    <b>{comment?.commentedUserName}</b>
                  </span>
                  <span style={{ marginLeft: "5px" }}>{comment?.comment}</span>
                  <br />
                </div>
            );
          })
        ) : (
          <span id={id} style={{ fontSize: "12px" }}>No Comments</span>
        )}
        {postDetails?.comments?.length>0 && (<span
          style={{ cursor: "pointer", fontSize: "14px" }}
          onClick={() => handleComment(postDetails._id)}
        >
          View all comments
        </span>)}
      </div>
      <span style={{ color: "var(--gray) ", fontSize: "10px",marginTop:'-10px' }}>
        {moment(postDetails?.createdAt).fromNow()}
      </span>
    </div>
  );
}

export default Post;

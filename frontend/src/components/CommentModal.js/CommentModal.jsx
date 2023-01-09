import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import SendIcon from "@mui/icons-material/Send";
import "./CommentModal.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import { POSTS_API } from "../../axios";
import { toast } from "react-hot-toast";
import { fetchUserById } from "../../redux/userSlice";
import moment from 'moment'

function CommentModal({
  commentModalOpen,
  setCommentModalOpen,
  comments,
  setComments,
  data,
}) {
  const theme = useMantineTheme();
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "formdata......");
    try {
      dispatch(showLoading());
      const response = await POSTS_API.post(`/${data._id}/comments`, formData);
      dispatch(hideLoading());
      if (response.data.status) {
        console.log(response.data.data,'sdajsdaskda')
        setComments((data) => [response.data.data, ...data]);
        setFormData({});
        Array.from(document.querySelectorAll("input")).forEach(
          (input) => (input.value = "")
        );
        dispatch(fetchUserById(token));
      } else {
        console.log(response);
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="40%"
      opened={commentModalOpen}
      onClose={() => {
        setCommentModalOpen(false)
        dispatch(fetchUserById(token));
      }}
    >
      <div>
        <h4>Comments</h4>
        {comments.length > 0 ? (
          comments?.map((comment, id) => {
            return (
              <>
                <div className="d-flex mt-4 flex-column" key={id}>
                  <div>
                    <img
                      src={comment?.commentedUserPic}
                      alt=""
                      className="me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "20px",
                      }}
                    />
                    <span>
                      <b>{comment?.commentedUserName}</b>
                    </span>
                    <span className="ms-3">{comment?.comment}</span>
                  </div>
                  <span style={{ fontSize: "10px",marginLeft:'57px',marginTop:'-10px' }}>
                    {moment(comment?.time).fromNow()}
                  </span>
                </div>
              </>
            );
          })
        ) : (
          <span style={{ fontSize: "12px", marginLeft: "15px" }}>
            No comments yet
          </span>
        )}
        <form action="" className="d-flex authForm" onSubmit={handleSubmit}>
          <input
            type="text"
            className="infoInput input"
            name="comment"
            placeholder="Add Comment"
            onChange={handleChange}
          />
          <button type="submit" className="bg-white border-0">
            <SendIcon />
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default CommentModal;

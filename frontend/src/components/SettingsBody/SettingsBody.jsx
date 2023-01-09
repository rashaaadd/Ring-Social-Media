import React, { useState } from "react";
import "./SettingsBody.css";
import SavedPost from "../SavedPosts/SavedPosts";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import { USER_API_POST } from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SettingsBody = ({ savedPost, changePass }) => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "11111");
    try {
      dispatch(showLoading());
      const response = await USER_API_POST(
        `/${user?._id}/verify-user`,
        formData
      );
      dispatch(hideLoading());
      if (response.data.status) {
        navigate(`/reset-password`, { state: { id: user?._id } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="SettingsBody">
      {savedPost ? (
        <>
          <h4>Saved Posts</h4>
          <div className="PostSide">
            <SavedPost />
          </div>
        </>
      ) : changePass ? (
        <>
        <h4>Reset password</h4>
          <form className="authForm infoForm" onSubmit={handleSubmit}>
            <h5>Please enter your current password to proceed.</h5>
            <input
              type="password"
              name="password"
              className="infoInput"
              onChange={handleChange}
            />
            <button type="submit" className="infoButton button">
              Send
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
};

export default SettingsBody;

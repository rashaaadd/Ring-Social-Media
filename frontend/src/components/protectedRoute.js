import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { setUser } from "../redux/userSlice";

function ProtectedRoute(props) {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUser = async () => {
    try {
      console.log("getUSer function executed");
      dispatch(showLoading());
      const response = await axios.get("http://localhost:5000/user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      dispatch(hideLoading());
      if (response.data.status) {
        dispatch(setUser(response.data.data));
        console.log(user);
      } else {
        console.log("Token Error");
        localStorage.clear();
        navigate("/");
      }
    } catch (e) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate("/");
      console.log(e.message, "Error getting user data");
    }
  };

  useEffect(() => {
    console.log("useEffect ran");
    if (!user) {
      getUser();
    }
  }, [user]);
  if (localStorage.getItem("token")) {
    return props.children;
  } else {
    return <Navigate to={"/"} />;
  }
}

export default ProtectedRoute;

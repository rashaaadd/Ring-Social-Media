import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./UsersList.css";
import { hideLoading, showLoading } from "../../../redux/alertSlice";
import toast from "react-hot-toast";
import { ADMIN_GET, ADMIN_PUT } from "../../../axios";
import Layout from "../Layout/Layout";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";

function UsersList() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const handleUserStatus = async (id) => {
    try {
      dispatch(showLoading());
      const response = await ADMIN_PUT(`/${id}`);
      dispatch(hideLoading());
      if (response.data.status) {
        setUsers((users)=>
            users?.map((user)=>{
                if(user._id === id){
                    return ({
                        ...user,
                        isBlocked:response.data.data.isBlocked ? true : false,
                    })
                }
                return user;
            })
        )
      }
    } catch (error) {
        dispatch(hideLoading());
        console.log(error);
        toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        dispatch(showLoading());
        const response = await ADMIN_GET("getusers");
        dispatch(hideLoading());
        if (response.data.status) {
          setUsers(response.data.data);
        } else {
          console.log(response);
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error);
        toast.error(error.response.data.message);
      }
    })();
  }, []);
  return (
    <Layout>
      <div>
        <h3>Users List</h3>
        <div className="userRow row">
          <span className="col-1">
            <b>Sl.No</b>
          </span>
          <span className="col-2">
            <b>Full Name</b>
          </span>
          <span className="col-2">
            <b>Username</b>
          </span>
          <span className="col-2">
            <b>Status</b>
          </span>
          <span className="col-2">
            <b>Email</b>
          </span>
        </div>
        {users?.map((user, id) => {
          return (
            <div className="userRow row" key={id}>
              <span className="col-1">{id + 1}</span>
              <span className="col-2">{`${user?.fname} ${user?.lname}`}</span>
              <span className="col-2">{user?.username}</span>
              <span className="col-2">
                {user?.isBlocked ? "Blocked" : "Active"}
              </span>
              <span className="col-2">{user?.email}</span>
              <span
                className="col-2 ms-5"
                style={{ cursor: "pointer" }}
                onClick={() => handleUserStatus(user?._id)}
              >
                {user?.isBlocked ? (
                  <PersonIcon style={{ color: "green" }} />
                ) : (
                  <PersonOffIcon style={{ color: "red" }} />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export default UsersList;

import React, { useState } from "react";
import "./AdminLogin.css";
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../../redux/alertSlice'
import { ADMIN_POST } from "../../../axios";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData,'formData........')
    try {
      dispatch(showLoading());
      const response = await ADMIN_POST('/login',formData)
      dispatch(hideLoading());
      if(response.data.status){
        toast.success(response.data.message)
        localStorage.setItem("adminToken",response.data.token)
        navigate('/admin/home')
      }else{
        toast.error(response.data.message)
        console.log(response)
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="AdminLogin" >
      <div className="title">
        <div className="a-left">
          <h4>Admin</h4>
        </div>
        <div className="a-right">
          <form action="" className="authForm infoForm" onSubmit={handleSubmit}>
            <h4> Login</h4>
            <div>
              <input
                type="text"
                placeholder="Username"
                className="infoInput"
                name="username"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="infoInput"
                name="password"
                onChange={handleChange}
                required
              />
            </div>
            <button className="button infoButton">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import './Auth.css'
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import Logo from '../../img/logo1.png'
import { hideLoading, showLoading } from "../../redux/alertSlice";
import { USER_API_POST } from "../../axios";


function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [signup, setSignup] = useState(false);
  const [formData, setFormData] = useState({});

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
    if (signup) {
      try {
        dispatch(showLoading());
        console.log(formData, "form.......data");
        const response = await USER_API_POST('/register',
          formData
        );
        console.log(response);
        dispatch(hideLoading());
        if (response.status) {
          toast.success(response.data.message);
          toast("Redirecting to Home Page");
          localStorage.setItem("token", response.data.data.token);
          setSignup((prev)=>!prev)
          Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
          );
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error, "Register error");
        toast.error(error.response.data.message);
      }
    } else {
      try {
        dispatch(showLoading());
        const response = await USER_API_POST('/login',
          formData
        );
        console.log(response, "resposnmeeaad");
        dispatch(hideLoading());
        toast.success(response.data.message);
        toast("Redirecting to Home Page");
        // console.log(formData, "fo1111111111111", response.data.data.token);
        localStorage.setItem("token", response.data.data.token);
        navigate("/home");
      } catch (error) {
        dispatch(hideLoading());
        console.log(error, " Login error");
        toast.error(error.response.data.message);
      }
    }
  }
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="Logo" />
        <div className="Webname">
          <h1>Ring!</h1>
          <h5>Connect.Express.Grow</h5>
        </div>
      </div>
      <div className="a-right">
        <form
          className="infoForm authForm"
          onSubmit={handleSubmit}
        >
          <h3>{signup ? "Signup" : "Login"}</h3>
          {signup && (
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="infoInput"
                name="fname"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="infoInput"
                name="lname"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            {signup && (
              <input
                type="text"
                placeholder="Username"
                className="infoInput"
                name="username"
                onChange={handleChange}
                required
              />
            )}
            {signup && (
              <input
                type="text"
                placeholder="Phone"
                className="infoInput"
                name="phone"
                onChange={handleChange}
                required
              />
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              className="infoInput"
              name="email"
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
            {signup && (
              <input
                type="password"
                placeholder="Confiirm Password"
                className="infoInput"
                name="confirmpass"
                onChange={handleChange}
                required
              />
            )}
          </div>

          <div>
            <p style={{ fontSize: "12px" }}>
              {signup ? "Already have an account? " : "Don't have an account? "}
              <span onClick={() => {
                setSignup((prev) => !prev)
                Array.from(document.querySelectorAll("input")).forEach(
                  input => (input.value = "")
                );
              }}>
                {signup ? "Login!" : "Signup"}
              </span>
            </p>
          </div>
          <button className="button infoButton" type="submit">
            {signup ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;

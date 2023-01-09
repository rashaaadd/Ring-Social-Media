import React, { useState } from "react";
import "./Auth.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Logo from "../../img/logo1.png";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import { USER_API_POST } from "../../axios";
import LockResetIcon from "@mui/icons-material/LockReset";
import Twilio from "../../components/Twilio/Twilio";

function Auth() {
  const dispatch = useDispatch();
  const [signup, setSignup] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);
  const [formData, setFormData] = useState({});
  const [passForm, setPassForm] = useState({});
  const [otpPage, setOtpPage] = useState(false);
  const [userData,setUserData] = useState({})
  const loading = useSelector((state) => state.alerts.loading);
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  const [forgotPass, setForgotPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signup) {
      try {
        if (formData.password === formData.confirmPass) {
          dispatch(showLoading());

          const response = await USER_API_POST("/register", formData);
          dispatch(hideLoading());
          if (response.status) {
            toast.success(response.data.message);
            toast("Redirecting to Login Page");
            setSignup((prev) => !prev);
            setConfirmPass(false);
            Array.from(document.querySelectorAll("input")).forEach(
              (input) => (input.value = "")
            );
          }
        } else {
          setConfirmPass(true);
          Array.from(document.querySelectorAll("input")).forEach(
            (input) => (input.value = "")
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
        const response = await USER_API_POST("/login", formData);
        dispatch(hideLoading());
        toast.success(response.data.message);
        toast("Redirecting to Home Page");
        localStorage.setItem("token", response.data.data.token);
      } catch (error) {
        dispatch(hideLoading());
        console.log(error, " Login error");
        toast.error(error.response.data.message);
      }
    }
  };
  const handlePassFormChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPassForm({ ...passForm, [name]: value });
  };

  const handlePassFormSubmit = async (e) => {
    e.preventDefault();
    console.log(passForm, "passForm details");
    try {
      dispatch(showLoading());
      const response = await USER_API_POST("/get-otp", passForm);
      dispatch(hideLoading());
      if (response.data.status) {
        setUserData(response.data.data)
        setOtpPage((prev) => !prev);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error, "ResetPassword error");
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      {!forgotPass && (
        <div className="Auth">
          <div className="a-left">
            <img src={Logo} alt="Logo" />
            <div className="Webname">
              <h1>Ring!</h1>
              <h5>Connect.Express.Grow</h5>
            </div>
          </div>
          <div className="a-right">
            <form className="infoForm authForm" onSubmit={handleSubmit}>
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
                  id="password"
                  name="password"
                  onChange={handleChange}
                  required
                />
                {signup && (
                  <input
                    type="password"
                    placeholder="Confiirm Password"
                    className="infoInput"
                    name="confirmPass"
                    onChange={handleChange}
                    data-rule-equalTo="#password"
                    required
                  />
                )}
              </div>
              {!signup && (
                <p
                  style={{
                    fontSize: "13px",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => setForgotPass((prev) => !prev)}
                >
                  Forgot password?
                </p>
              )}
              {confirmPass && (
                <span
                  style={{
                    color: "red",
                    fontSize: "14px",
                    alignSelf: "flex-end",
                    marginRight: "30px",
                  }}
                >
                  *Enter the same password
                </span>
              )}
              <div>
                <p style={{ fontSize: "12px" }}>
                  {signup
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <span
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "13px",
                    }}
                    onClick={() => {
                      setSignup((prev) => !prev);
                      setConfirmPass(false);
                      Array.from(document.querySelectorAll("input")).forEach(
                        (input) => (input.value = "")
                      );
                    }}
                  >
                    {signup ? "Login!" : "Signup"}
                  </span>
                </p>
              </div>
              <button
                className="button infoButton"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : signup ? "Register" : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}
      {forgotPass && (
        <div className="Auth">
          <div
            className="a-left"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <LockResetIcon sx={{ fontSize: 40 }} />
            <h3>Trouble Logging in?</h3>
          </div>
          <div className="a-right">
            {otpPage ? (
              <Twilio userData={userData}/>
            ) : (
              <form
                onSubmit={handlePassFormSubmit}
                className="infoForm authForm otpForm"
              >
                <p
                  style={{
                    width: "80%",
                    textJustify: "center",
                    paddingTop: "10px",
                  }}
                >
                  Enter the phone number registered with your account!
                </p>
                <p
                  style={{ width: "80%", fontSize: "11px", marginTop: "-35px" }}
                >
                  An OTP will be sent to the phone number, if registered
                </p>
                <input
                  type="tel"
                  placeholder="Enter here..."
                  className="infoInput"
                  name="phone"
                  onChange={handlePassFormChange}
                  required
                  style={{ width: "350px", marginTop: "-20px" }}
                />
                <p
                  style={{
                    fontSize: "13px",
                  }}
                >
                  Return to
                  <span
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                    onClick={() => setForgotPass((prev) => !prev)}
                  >
                    Login?
                  </span>
                </p>
                <button className="button infoButton">Send OTP</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;

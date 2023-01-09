import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { USER_API_POST } from "../../axios";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import "./Twilio.css";
import { useNavigate } from "react-router-dom";

function Twilio({ userData }) {
  console.log(userData, "userDataaa at twiliooo");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "formData at Otp");
    formData.userData = userData;
    try {
      dispatch(showLoading());
      const response = await USER_API_POST("/verify-otp", formData);
      dispatch(hideLoading());
      const userId = response.data.data;
      if (response.data.status) {
        navigate(`/reset-password`, { state: { id: userId } });
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      console.log("next");
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
    console.log(formData, "ldkfsdfndsfsnf");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="infoForm authForm">
        <h5>OTP sent</h5>
        <h6 className='otpText'>
          {`We sent an OTP to +91-${userData.phone.slice(0, 3)}****
          ${userData.phone.slice(-3)}. Please verify yourself to change
          password.`}
        </h6>
        <div className="otpContainer">
          <input
            name="otp1"
            type="text"
            autoComplete="off"
            className="otpInput"
            onChange={handleChange}
            tabIndex="1"
            maxLength="1"
            onKeyUp={inputfocus}
          />
          <input
            name="otp2"
            type="text"
            autoComplete="off"
            className="otpInput"
            onChange={handleChange}
            tabIndex="2"
            maxLength="1"
            onKeyUp={inputfocus}
          />
          <input
            name="otp3"
            type="text"
            autoComplete="off"
            className="otpInput"
            onChange={handleChange}
            tabIndex="3"
            maxLength="1"
            onKeyUp={inputfocus}
          />
          <input
            name="otp4"
            type="text"
            autoComplete="off"
            className="otpInput"
            onChange={handleChange}
            tabIndex="4"
            maxLength="1"
            onKeyUp={inputfocus}
          />

          <input
            name="otp5"
            type="text"
            autoComplete="off"
            className="otpInput"
            onChange={handleChange}
            tabIndex="5"
            maxLength="1"
            onKeyUp={inputfocus}
          />
          <input
            name="otp6"
            type="text"
            autoComplete="off"
            className="otpInput"
            onChange={handleChange}
            tabIndex="6"
            maxLength="1"
            onKeyUp={inputfocus}
          />
        </div>
        <button className="button infoButton" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default Twilio;

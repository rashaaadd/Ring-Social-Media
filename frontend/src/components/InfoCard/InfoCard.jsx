import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/userSlice";

function InfoCard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(resetUser(null))
    localStorage.clear()
    navigate('/')
  }

  const [modalOpened, setModalOpened] = useState(false);
  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>Your Info</h4>
        <div>
          <UilPen
            width="2rem"
            height="1.5rem"
            onClick={() => setModalOpened(true)}
          />
          <ProfileModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
          />
        </div>
      </div>

      <div className="info">
        <span>
          <b>Status</b>
        </span>
        <span> Single</span>
      </div>
      <div className="info">
        <span>
          <b>Lives in</b>
        </span>
        <span> Calicut</span>
      </div>
      <div className="info">
        <span>
          <b>Works at</b>
        </span>
        <span> Brototype</span>
      </div>

      <button className="button logout-btn" onClick={()=>handleLogout()}>Logout</button>
    </div>
  );
}

export default InfoCard;

import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../redux/userSlice";

function InfoCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.users);
  const handleLogout = () => {
    dispatch(resetUser(null));
    localStorage.clear();
    navigate("/");
  };
  let profileUser;
  if (location.state) {
    profileUser = location.state;
  }

  const [modalOpened, setModalOpened] = useState(false);
  return (
    <>
      {profileUser ? (
        <div className="InfoCard">
          <div className="infoHead">
            <h4>Info</h4>
          </div>

          <div className="info">
            <span>
              <b>Status</b>
            </span>
            <span className="ms-3"> {profileUser?.details?.relation ? profileUser?.details?.relation : "Not provided"}</span>
          </div>
          <div className="info">
            <span>
              <b>Lives in</b>
            </span>
            <span className="ms-3">{profileUser?.details?.city ? profileUser?.details?.city : 'Not provided'}</span>
          </div>
          <div className="info">
            <span>
              <b>Works at</b>
            </span>
            <span className="ms-3">{profileUser?.details?.work ? profileUser?.details?.work : 'Not provided'}</span>
          </div>
        </div>
      ) : (
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
            <span className="ms-3"> {user?.details?.relation}</span>
          </div>
          <div className="info">
            <span>
              <b>Lives in</b>
            </span>
            <span className="ms-3">{user?.details?.city}</span>
          </div>
          <div className="info">
            <span>
              <b>Works at</b>
            </span>
            <span className="ms-3">{user?.details?.work}</span>
          </div>

          <button className="button logout-btn" onClick={() => handleLogout()}>
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default InfoCard;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { USER_API, USER_API_GET } from "../../axios";

const Conversation = ({ data, currentUserId, online }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    (async () => {
      const userId = data.members.find((id) => id !== currentUserId);
      try {
        if (userId) {
          const response = await USER_API_GET(`/user/${userId}`);
          console.log(response.data.data);
          if (response.data.status) {
            setUserData(response.data.data);
          } else {
            console.log(response.data.message, "Error");
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={userData?.profilePic}
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
            alt=""
          />
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>
              {userData?.fname} {userData?.lname}
            </span>
            <span>{online ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid grey" }} />
    </>
  );
};

export default Conversation;

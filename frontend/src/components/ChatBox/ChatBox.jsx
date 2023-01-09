import React, { useEffect, useRef, useState } from "react";
import "./ChatBox.css";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_API_GET, MESSAGE_API_POST, USER_API_GET } from "../../axios";
import { fetchUserById } from "../../redux/userSlice";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUserId, setSendMessage, recieveMessage }) => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.users);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const scroll = useRef()

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };
  console.log(recieveMessage,'........',chat?._id)
  useEffect(() => {
    if(recieveMessage !== null && recieveMessage.chatId === chat?._id){
      setMessages([...messages,recieveMessage]);
    }
  })

  //fetch userData for Header
  useEffect(() => {
    (async () => {
      const userId = chat?.members.find((id) => id !== currentUserId);
      try {
        const response = await USER_API_GET(`/user/${userId}`);
        if (response.data.status) {
          setUserData(response.data.data);
        } else {
          console.log(response.data.message, "Error");
        }
      } catch (error) {
        console.log(error);
      }
    })();
    if (!user) {
      dispatch(fetchUserById(token));
    }
  }, [chat, currentUserId, dispatch]);

  // Get messages from server

  useEffect(() => {
    (async () => {
      try {
        const response = await MESSAGE_API_GET(`/${chat?._id}`);
        console.log(response);
        if (response.data.status) {
          setMessages(response.data.data);
        } else {
          console.log(response.data.message, "Error111");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [chat]);

  //Always scroll to last message

  useEffect(()=>{
    scroll.current?.scrollIntoView({ behavior: "smooth" })
  },[messages])

  const handleSend = async(e) => {
    e.preventDefault();
    const message = {
      senderId: currentUserId,
      message: newMessage,
      chatId: chat._id
    }
    try {
      const response = await MESSAGE_API_POST('/',message)
      if(response.data.status){
        setMessages([...messages, response.data.data])
        setNewMessage('')
      }else{
        console.log(response.data.message,'Error')
      }
    } catch (error) {
      console.log(error)
    }
    
    const recieverId = chat.members.find((id) => {
      return id !== currentUserId
    })
    setSendMessage({...message,recieverId})
  }
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div style={{ margin: "0 20px" }}>
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
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "85%",
                  border: "0.1px solid grey",
                  margin: "15px auto",
                }}
              />
            </div>

            {/* chatbox messages */}
            <div className="chat-body">
              {messages?.map((message) => (
                <>
                  <div
                    ref={scroll}
                    className={
                      message.senderId == currentUserId
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message?.message}</span>
                    <span>{moment(message?.createdAt).fromNow()}</span>
                  </div>
                </>
              ))}
            </div>

            {/* chat sender */}
            <div className="chat-sender">
              <div></div>
              <InputEmoji value={newMessage} onChange={handleChange} />
              <div className="send-button button" onClick={handleSend}>Send</div>
            </div>
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a Chat to start conversation.
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;

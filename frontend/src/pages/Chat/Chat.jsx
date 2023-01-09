import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { useDispatch, useSelector } from "react-redux";
import { CHAT_API } from "../../axios";
// import LogoSearch from "../../components/LogoSearch/LogoSearch";
import Conversation from "../../components/Conversation/Conversation";
import { fetchUserById } from "../../redux/userSlice";  
import "./Chat.css";
import ChatBox from "../../components/ChatBox/ChatBox";
import  {io}  from "socket.io-client";

function Chat() {
  const { user } = useSelector((state) => state.users);
  const token = localStorage.getItem("token");
  const socket = useRef();
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserById(token));
    }
  }, []);

  // add new user to socket
  useEffect(() => {
    socket.current = io("ws://localhost:3001");
    if (user) {
      socket.current.emit("new-user-add", user._id);
    }
    socket.current.on("get-users", (users) => {
      console.log(users, "users at socket connection useffect");
      setOnlineUsers(users);
    });
  }, [user]);
  // recieve message from socket server

  useEffect(() => {
    console.log("Useeffect");
    socket.current.on("recieve-message", (data) => {
      console.log(data, "data at recievers end in socket");
      setRecieveMessage(data);
    });
  }, []);


  //send message to socket server

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    (async () => {
      try {
        const response = await CHAT_API.get(`/${user?._id}`);
        console.log(response, "asdjkdab");
        if (response.data.status) {
          setChats(response.data.data);
        } else {
          toast.error(response.data.message);
          console.log(response);
        }
      } catch (e) {
        toast.error(e.response.data.message);
        console.log(e);
      }
    })();
  }, [user]);
  
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user?._id)
    const online = onlineUsers.find((user) => user.userId === chatMember)
    return online? true : false 
  }

  const handleClick = () => {
    socket.current.emit('disconnect')
  }

  console.log(recieveMessage, "sdkbhsfbsjkabfasjkhkja111111111111111");

  return (
    <div className="Chat">
      {/* Left side */}
      <div className="Left-side-chat">
        {/* <LogoSearch /> */}
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat, id) => (
              <div key={id} onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUserId={user?._id} online={checkOnlineStatus(chat)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <div className="navIcons">
            <Link to={"/home"} onClick={handleClick}>
              <img src={Home} alt="" />
            </Link>
            <img src={Noti} alt="" />
            <Link to={"/chat"}>
              <img src={Comment} alt="" />
            </Link>
          </div>
        </div>

        <ChatBox
          chat={currentChat}
          currentUserId={user?._id}
          setSendMessage={setSendMessage}
          recieveMessage={recieveMessage}
        />
      </div>
    </div>
  );
}

export default Chat;

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // Add new User
  socket.on("new-user-add", (newUserId) => {
    //if user not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
  //send message
  socket.on("send-message", (data) => {
    const { recieverId } = data;
    const user = activeUsers.find((user) => user.userId === recieverId);
    console.log("Sending from socket to :", recieverId);
    console.log(user,"Data", data);
    if (user) {
      console.log(data, "hshahdjajklsdkj");
      io.to(user?.socketId).emit("recieve-message", data);
    }
  });
});

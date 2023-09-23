import express from "express";
const app = express();
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("User connected to " + socket.id);

  socket.on("join_group", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined ${data}`);
  });
  socket.on("send_message", (data) => {
    socket.to(data.group).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("User" + socket.id + " disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER IS WORKING ON PORT ${PORT}`);
});
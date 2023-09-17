import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  setUpRoom,
  disconnectFromRoom,
} from "./controllers/room-controller.js";
import { broadcastJoin, sendMessage } from "./controllers/chat-controller.js";
import { connectToDB } from "./model/db.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Run when client connects
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("set-up-room", (roomId) => {
    setUpRoom(socket, roomId);
  });

  socket.on("join-room", (roomId) => {
    broadcastJoin(socket, roomId, io);
  });

  socket.on("send-message", (message, roomId) => {
    sendMessage(socket, message, roomId, io);
  });

  socket.on("disconnecting", () => {
    disconnectFromRoom(socket, io);
  });

  socket.on("disconnect", () => {});
});

app.use(cors());
app.use(express.json());

httpServer.listen(3002, () => {
  console.log("collaboration-service started on port 3002");
  connectToDB();
});

import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  setUpRoom,
  disconnectFromRoom,
  leaveRoom,
} from "./controllers/room-controller.js";
import { broadcastJoin, sendMessage } from "./controllers/chat-controller.js";
import { connectToDB } from "./model/db.js";
import Redis from "ioredis";

// Connect to the default Redis server running on localhost and default port 6379
// Run redis-server locally
const redis = new Redis();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

// Run when client connects
io.on("connection", (socket) => {
  const uuid = socket.handshake.query.uuid;
  socket.uuid = uuid;
  console.log(`User ${socket.uuid} connected`);

  socket.on("set-up-room", (roomId) => {
    setUpRoom(socket, roomId, redis);
  });

  socket.on("join-room", (roomId) => {
    broadcastJoin(socket, roomId, io, redis);
  });

  socket.on("leave-room", (roomId) => {
    leaveRoom(socket, roomId, io, redis);
  });

  socket.on("send-message", (message, roomId) => {
    sendMessage(socket, message, roomId, io, redis);
  });

  socket.on("disconnecting", () => {
    disconnectFromRoom(socket, io, redis);
  });

  socket.on("disconnect", () => {});
});

app.use(cors());
app.use(express.json());

httpServer.listen(3004, () => {
  console.log("collaboration-service started on port 3004");
  connectToDB();
});

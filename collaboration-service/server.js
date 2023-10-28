import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  setUpRoom,
  disconnectFromRoom,
  leaveRoom,
  getRoomDetails,
} from "./controllers/room-controller.js";
import { broadcastJoin, sendMessage } from "./controllers/chat-controller.js";
import { pushCode, syncCode } from "./controllers/editor-controller.js";
import { connectToDB } from "./model/db.js";
import Redis from "ioredis";
import { attemptToAuthenticate, auth } from "./middleware/auth.js";


// Connect to the default Redis server running on localhost and default port 6379
// Run redis-server locally
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

// Middleware to authenticate user before allowing them to connect to socket.io server
io.use(async (socket, next) => {
  attemptToAuthenticate(socket, next);
});

// Run when client connects
io.on("connection", (socket) => {
  socket.uuid = socket.handshake.query.uuid;
  socket.username = socket.handshake.query.username;
  console.log(`User ${socket.username} connected`);

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

  socket.on("push-code", (code, roomId) => {
    pushCode(socket, code, roomId, io, redis);
  });

  socket.on("sync-code", (code, roomId) => {
    syncCode(socket, code, roomId, io, redis);
  });

  socket.on("disconnecting", async () => {
    disconnectFromRoom(socket, io, redis);
  });

  socket.on("disconnect", () => {});
});

app.use(cors());
app.use(express.json());

app.post("/roomDetails", auth, getRoomDetails);

httpServer.listen(3004, () => {
  console.log("collaboration-service started on port 3004");
  connectToDB();
});

const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const {
  setUpRoom,
  disconnectFromRoom,
  leaveRoom,
  getRoomDetails,
  getPastAttempts,
} = require("./controllers/room-controller.js");
const {
  broadcastJoin,
  sendMessage,
} = require("./controllers/chat-controller.js");
const { pushCode, executeCode } = require("./controllers/editor-controller.js");
const { connectToDB } = require("./model/db.js");
const Redis = require("ioredis");
const { attemptToAuthenticate, auth } = require("./middleware/auth.js");
const {options} = require("axios");

const rapidApiKey = process.env.RAPID_API_KEY;
const rapidApiHost = process.env.RAPID_API_HOST || "judge0-ce.p.rapidapi.com";

const rapid_post_options = {
  method: 'POST',
  hostname: rapidApiHost,
  port: null,
  path: '/submissions?base64_encoded=true&fields=*',
  headers: {
    'content-type': 'application/json',
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': rapidApiKey,
    'X-RapidAPI-Host': rapidApiHost
  }
};

const rapid_get_options = (token) => {
  return {
    method: 'GET',
    hostname: rapidApiHost,
    port: null,
    path: `/submissions/${token}?base64_encoded=true&fields=*`,
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': rapidApiHost
    }
  };
}


// Connect to the default Redis server running on localhost and default port 6379
// Run redis-server locally
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3002",
    methods: ["GET", "POST"],
  },
  // path: "/collaboration-service/socket.io/",
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
    broadcastJoin(socket, roomId, io);
  });

  socket.on("leave-room", (roomId) => {
    leaveRoom(socket, roomId, io, redis);
  });

  socket.on("send-message", (message, roomId) => {
    sendMessage(socket, message, roomId, io);
  });

  socket.on("push-code", (changes, code, roomId) => {
    pushCode(socket, changes, code, roomId, redis);
  });

  socket.on("execute-code", (roomId, code, stdin, language) => {
    executeCode(socket, roomId, http, rapid_post_options, rapid_get_options, code, stdin, language);
  });

  socket.on("disconnecting", async () => {
    disconnectFromRoom(socket, io, redis);
  });

  socket.on("disconnect", () => {});
});

app.use(cors());
app.use(express.json());

app.post("/roomDetails", auth, getRoomDetails);
app.post("/getPastAttempts", auth, getPastAttempts);

httpServer.listen(3004, () => {
  console.log("collaboration-service started on port 3004");
  connectToDB();
});




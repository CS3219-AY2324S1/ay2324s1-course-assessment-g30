const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const {
  setUpRoom,
  disconnectFromRoom,
  leaveRoom,
  getRoomDetails,
  saveStateToDb,
} = require("./controllers/room-controller.js");
const {
  broadcastJoin,
  sendMessage,
} = require("./controllers/chat-controller.js");
const { pushCode, } = require("./controllers/editor-controller.js");
const { connectToDB } = require("./model/db.js");
const Redis = require("ioredis");
const { attemptToAuthenticate, auth } = require("./middleware/auth.js");

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
    broadcastJoin(socket, roomId, io);
  });

  socket.on("leave-room", (roomId) => {
    leaveRoom(socket, roomId, io);
  });

  socket.on("send-message", (message, roomId) => {
    sendMessage(socket, message, roomId, io);
  });

  socket.on("push-code", (code, roomId) => {
    // might add a timer to only allow a trigger once every min
    // if perf is an issue
    pushCode(socket, code, roomId, io, redis);
  });


  socket.on("disconnecting", async () => {
    disconnectFromRoom(socket, io);
  });

  socket.on("disconnect", () => {
    // Add event to save DB here
    saveStateToDb(socket, roomId, redis)
  });

  socket.on("connect_error", (err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
    console.log(err.data); // { content: "Please retry later" }
  });
});

app.use(cors());
app.use(express.json());

app.post("/roomDetails", auth, getRoomDetails);

httpServer.listen(3004, () => {
  console.log("collaboration-service started on port 3004");
  connectToDB();
});

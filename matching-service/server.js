import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  removeFromQueue,
  pairUsers,
  removeFromAllQueues,
  joinRoom,
  createRoom,
} from "./controllers/matchmaking-controller.js";

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

  socket.on("match-me-with-a-stranger", (difficulty) => {
    pairUsers(socket, difficulty);
  });

  socket.on("join-room", (roomId) => {
    joinRoom(socket, roomId);
  });

  socket.on("create-room", (difficulty) => {
    createRoom(socket, difficulty);
  });

  socket.on("cancel-matching", (difficulty) => {
    removeFromQueue(socket, difficulty);
  });

  socket.on("disconnect", () => {
    removeFromAllQueues(socket);
  });
});

app.use(cors());
app.use(express.json());

httpServer.listen(3001, () => {
  console.log("matching-service started on port 3001");
});

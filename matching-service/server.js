import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  removeFromQueue,
  pairUsers,
  removeFromAllQueues,
  createRoom,
} from "./controllers/matchmaking-controller.js";
import { connectToDB } from "./model/db.js";
import { getJoinedRooms } from "./controllers/room-controller.js";

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
  console.log(`User ${socket.uuid}|${socket.id} connected`);

  socket.on("match-me-with-a-stranger", (difficulty, programmingLanguage) => {
    pairUsers(socket, difficulty, programmingLanguage);
  });

  socket.on("create-room", (difficulty, programmingLanguage) => {
    createRoom(socket, difficulty, programmingLanguage);
  });

  socket.on("cancel-matching", (difficulty, programmingLanguage) => {
    removeFromQueue(socket, difficulty, programmingLanguage);
  });

  socket.on("disconnect", () => {
    removeFromAllQueues(socket);
  });
});

app.use(cors());
app.use(express.json());

app.get("/joinedRooms", getJoinedRooms);

httpServer.listen(3003, () => {
  console.log("matching-service started on port 3003");
  connectToDB();
});

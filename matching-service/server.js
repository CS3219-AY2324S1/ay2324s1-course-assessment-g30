import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const matchingQueue = {
  easy: [],
  medium: [],
  hard: [],
};
// Run when client connects
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Handle 'match' event when a user chooses a difficulty
  socket.on("lets-rumble", (difficulty) => {
    console.log(`User ${socket.id} joined matching queue for ${difficulty}`);
    matchingQueue[difficulty].push(socket);

    // Check if there are at least two users in the queue
    if (matchingQueue[difficulty].length >= 2) {
      // Pair the first two users in the queue
      const user1 = matchingQueue[difficulty].shift();
      const user2 = matchingQueue[difficulty].shift();

      // Create a unique room ID for the pair
      const roomId = `${user1.id}-${user2.id}`;

      // Join both users to the room
      user1.join(roomId);
      user2.join(roomId);

      // Notify both users that they are paired
      io.to(roomId).emit("paired", roomId);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);

    // Remove the user from the queue if they disconnect
    for (const difficulty in matchingQueue) {
      const index = matchingQueue[difficulty].indexOf(socket);
      if (index !== -1) {
        matchingQueue[difficulty].splice(index, 1);
      }
    }
  });
});

app.use(cors());
app.use(express.json());

httpServer.listen(3001, () => {
  console.log("server started on port 3001");
});

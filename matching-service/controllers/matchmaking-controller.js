import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

// Connect to the default Redis server running on localhost and default port 6379
// Run redis-server locally
const redis = new Redis();

const roomIds = []; // Will bring in DB later to do this (prob want to include roomid, difficulty)

/**
 * Removes a socket ID from a matchmaking queue.
 */
export const removeFromQueue = async (socket, difficulty) => {
  const queueName = `${difficulty}Queue`;
  const socketId = socket.id;

  await redis.lrem(queueName, 0, socketId);

  console.log(`User ${socketId} removed from matching queue for ${difficulty}`);
};

/**
 * Removes a socket ID from all matchmaking queues.
 */
export const removeFromAllQueues = async (socket) => {
  console.log(`User ${socket.id} disconnected`);
  const difficultyLevels = ["easy", "medium", "hard"];

  for (const difficulty of difficultyLevels) {
    removeFromQueue(socket, difficulty);
  }
};

/**
 * Pairs users from a matchmaking queue and performs necessary actions.
 */
export const pairUsers = async (socket, difficulty) => {
  console.log(`User ${socket.id} joined matching queue for ${difficulty}`);

  const queueName = `${difficulty}Queue`;
  const queueSize = await redis.llen(queueName);

  if (queueSize >= 1) {
    const partnerId = await redis.lpop(queueName);

    if (socket.id !== partnerId) {
      const roomId = uuidv4();
      roomIds.push(roomId);

      // Notify both users that they can join the room
      socket.emit("found-room", roomId);
      socket.to(partnerId).emit("found-room", roomId);
    }
  } else {
    redis.rpush(`${difficulty}Queue`, socket.id);
  }
};

/**
 * Check if room id exists in the database
 */
export const joinRoom = async (socket, roomId) => {
  const index = roomIds.indexOf(roomId);

  if (index != -1) {
    socket.emit("valid-room-id");

    setTimeout(() => {
      socket.emit("found-room", roomId);
    }, 2000);
  } else {
    socket.emit("invalid-room-id");
  }
};

/**
 * Create a room id and add it to the database
 */
export const createRoom = async (socket, difficulty) => {
  const roomId = uuidv4();
  roomIds.push(roomId);

  socket.emit("room-created");

  setTimeout(() => {
    socket.emit("found-room", roomId);
  }, 2000);
};

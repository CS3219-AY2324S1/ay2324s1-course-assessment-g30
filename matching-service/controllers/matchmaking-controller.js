import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import Room from "../model/room-model.js";

// Connect to the default Redis server running on localhost and default port 6379
// Run redis-server locally
const redis = new Redis();

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
  try {
    console.log(`User ${socket.id} joined matching queue for ${difficulty}`);

    const queueName = `${difficulty}Queue`;
    const queueSize = await redis.llen(queueName);

    if (queueSize >= 1) {
      const partnerId = await redis.lpop(queueName);

      if (socket.id !== partnerId) {
        const roomId = await generateUniqueRoomId();
        await setUpRoom(roomId, difficulty);

        // Notify both users that they can join the room
        socket.emit("found-room", roomId);
        socket.to(partnerId).emit("found-room", roomId);
      }
    } else {
      redis.rpush(`${difficulty}Queue`, socket.id);
    }
  } catch (err) {
    console.error("Error pairing users:", err);
  }
};

/**
 * Check if room id exists in the database
 */
export const joinRoom = async (socket, roomId) => {
  const existingRoom = await Room.findOne({ room_id: roomId });

  if (existingRoom) {
    socket.emit("valid-room-id");

    setTimeout(() => {
      socket.emit("found-room", roomId);
    }, 2000);
  } else {
    socket.emit("invalid-room-id");
  }
};

/**
 * Set up room and add it to the database
 */
export const setUpRoom = async (roomId, difficulty) => {
  try {
    const newRoom = new Room({
      room_id: roomId,
      question_difficulty: difficulty,
    });

    await newRoom.save();
  } catch (err) {
    console.error("Error setting up room:", err);
    throw err;
  }
};

/**
 * Create a room for the user
 */
export const createRoom = async (socket, difficulty) => {
  try {
    const roomId = await generateUniqueRoomId();
    await setUpRoom(roomId, difficulty);

    socket.emit("room-created");

    setTimeout(() => {
      socket.emit("found-room", roomId);
    }, 2000);
  } catch (err) {
    console.error("Error creating room:", err);
  }
};

/**
 * Genenerate a unique room id
 */
export const generateUniqueRoomId = async () => {
  let roomId;
  let isUnique = false;

  while (!isUnique) {
    roomId = uuidv4();

    const existingRoom = await Room.findOne({ room_id: roomId });

    if (!existingRoom) {
      isUnique = true;
    }
  }
  return roomId;
};

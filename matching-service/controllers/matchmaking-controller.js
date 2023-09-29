import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import Room from "../model/room-model.js";

// Connect to the default Redis server running on localhost and default port 6379
// Run redis-server locally
const redis = new Redis();

/**
 * Removes a user from a matchmaking queue.
 */
export const removeFromQueue = async (
  socket,
  difficulty,
  programmingLanguage
) => {
  const queueName = `${difficulty}-${programmingLanguage}Queue`;
  const userId = socket.uuid + "|" + socket.id;

  await redis.lrem(queueName, 0, userId);

  console.log(
    `User ${userId} removed from matching queue for ${difficulty} and with language ${programmingLanguage}`
  );
};

/**
 * Removes a user from all matchmaking queues.
 */
export const removeFromAllQueues = async (socket) => {
  const queueNamePattern = "*Queue"; // Adjust the pattern as needed
  try {
    const queueNames = await redis.keys(queueNamePattern);
    const userId = socket.uuid + "|" + socket.id;
    console.log(`User ${userId} disconnected`);

    for (const queueName of queueNames) {
      await redis.lrem(queueName, 0, userId);
      console.log(
        `User ${userId} removed from matching queue for ${queueName}`
      );
    }
  } catch (err) {
    console.error("Error retrieving queue names:", err);
  }
};

/**
 * Pairs users from a matchmaking queue and performs necessary actions.
 */
export const pairUsers = async (socket, difficulty, programmingLanguage) => {
  try {
    const userId = socket.uuid + "|" + socket.id;
    console.log(
      `User ${userId} joined matching queue for ${difficulty} and with language ${programmingLanguage}`
    );

    const queueName = `${difficulty}-${programmingLanguage}Queue`;
    const queueSize = await redis.llen(queueName);

    if (queueSize >= 1) {
      const partnerUserId = await redis.lpop(queueName);
      const pair = partnerUserId.split("|");
      const partnerUUID = pair[0];
      const partnerSocketId = pair[1];

      if (socket.uuid !== partnerUUID) {
        const roomId = await generateUniqueRoomId();
        await setUpRoom(roomId, difficulty, programmingLanguage);

        // Notify both users that they can join the room
        socket.emit("found-room", roomId);
        socket.to(partnerSocketId).emit("found-room", roomId);
      } else {
        // Put the first matching back into the queue
        redis.rpush(queueName, partnerUserId);
        socket.emit("you-joined-queue-twice");
      }
    } else {
      redis.rpush(queueName, userId);
    }
  } catch (err) {
    console.error("Error pairing users:", err);
  }
};

/**
 * Set up room and add it to the database
 */
export const setUpRoom = async (roomId, difficulty, programmingLanguage) => {
  try {
    const newRoom = new Room({
      room_id: roomId,
      question_difficulty: difficulty,
      programming_language: programmingLanguage,
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
export const createRoom = async (socket, difficulty, programmingLanguage) => {
  try {
    const roomId = await generateUniqueRoomId();
    await setUpRoom(roomId, difficulty, programmingLanguage);

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
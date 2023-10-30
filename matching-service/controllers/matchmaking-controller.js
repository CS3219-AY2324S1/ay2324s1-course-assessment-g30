const Redis = require("ioredis");
const { v4: uuidv4 } = require("uuid");
const Room = require("../model/room-model.js");
const axios = require("axios");

// Connect to the default Redis server running on localhost and default port 6379
// Run redis-server locally
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

redis.on("connect", () => {
  console.log("Connected to the Redis server.");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

/**
 * Removes a user from a matchmaking queue.
 */
const removeFromQueue = async (socket, difficulty, programmingLanguage) => {
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
const removeFromAllQueues = async (socket) => {
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
const pairUsers = async (socket, difficulty, programmingLanguage) => {
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
        await setUpRoom(socket, roomId, difficulty, programmingLanguage);

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
const setUpRoom = async (socket, roomId, difficulty, programmingLanguage) => {
  try {
    const QUESTION_SERVICE_BASE_URL =
      process.env.QUESTION_SERVICE_URL || "http://localhost:3001/api";
    const url = QUESTION_SERVICE_BASE_URL + "/readRandomQuestion";
    const capitalizedDifficulty =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        token: socket.token,
        uuid: socket.uuid,
        question_complexity: capitalizedDifficulty,
      }),
    };
    const res = await axios(config);
    const question = res.data.question;

    const newRoom = new Room({
      room_id: roomId,
      question_difficulty: difficulty,
      question_id: question.question_id,
      programming_language: programmingLanguage,
    });

    await newRoom.save();
  } catch (err) {
    console.error("Error setting up room:", err);
    throw err;
  }
};

/**
 * Create a room for the user with a random question of said difficulty
 */
const createRoom = async (socket, difficulty, programmingLanguage) => {
  try {
    const roomId = await generateUniqueRoomId();
    await setUpRoom(socket, roomId, difficulty, programmingLanguage);

    socket.emit("room-created");

    setTimeout(() => {
      socket.emit("found-room", roomId);
    }, 2000);
  } catch (err) {
    console.error("Error creating room:", err);
  }
};

/**
 * Create a room for the user with a specified question
 */
const createRoomWithQuestion = async (
  socket,
  questionId,
  programmingLanguage
) => {
  try {
    const roomId = await generateUniqueRoomId();
    const newRoom = new Room({
      room_id: roomId,
      question_id: questionId,
      programming_language: programmingLanguage,
    });

    await newRoom.save();

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
const generateUniqueRoomId = async () => {
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

module.exports = {
  removeFromQueue,
  removeFromAllQueues,
  pairUsers,
  setUpRoom,
  createRoom,
  createRoomWithQuestion,
  generateUniqueRoomId,
};

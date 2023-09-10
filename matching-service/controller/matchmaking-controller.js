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

  for (const difficulty in difficultyLevels) {
    removeFromQueue(socket, difficulty);
  }
};

/**
 * Pairs users from a matchmaking queue and performs necessary actions.
 */
export const pairUsers = async (socket, difficulty, io) => {
  redis.rpush(`${difficulty}Queue`, socket.id);
  console.log(`User ${socket.id} joined matching queue for ${difficulty}`);

  const queueName = `${difficulty}Queue`;
  const queueSize = await redis.llen(queueName);

  if (queueSize >= 2) {
    const user1 = await redis.lpop(queueName);
    const user2 = await redis.lpop(queueName);

    if (user1 !== user2) {
      const roomId = `${user1}-${user2}`;

      // Join both users to the room
      user1.join(roomId);
      user2.join(roomId);

      // Notify both users that they are paired
      io.to(roomId).emit("paired", roomId);
    }
  }
};

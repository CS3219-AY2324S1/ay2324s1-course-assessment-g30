/**
 * Broadcasts a join message to all users in a room
 */
export const broadcastJoin = async (socket, roomId, io, redis) => {
  console.log(`User ${socket.id} joined room ${roomId}`);
  const chatKey = `chat:${roomId}`;
  await redis.rpush(
    chatKey,
    JSON.stringify({
      senderId: socket.id,
      message: "has joined the room!",
      type: "announcement",
    })
  );

  io.to(roomId).emit("user-joined", {
    userId: socket.id,
    message: "has joined the room!",
  });
};

/**
 * Broadcasts a leave message to all users in a room
 */
export const broadcastLeave = async (socket, roomId, io, redis) => {
  console.log(`User ${socket.id} left room ${roomId}`);
  const chatKey = `chat:${roomId}`;
  await redis.rpush(
    chatKey,
    JSON.stringify({
      senderId: socket.id,
      message: "has left the room.",
      type: "announcement",
    })
  );

  io.to(roomId).emit("user-left", {
    userId: socket.id,
    message: "has left the room.",
  });
};

/**
 * Broadcasts a message to all users in a room
 */
export const sendMessage = async (socket, message, roomId, io, redis) => {
  console.log(`User ${socket.id} sent message: ${message} to room:${roomId}`);
  const chatKey = `chat:${roomId}`;
  await redis.rpush(
    chatKey,
    JSON.stringify({ senderId: socket.id, message, type: "chat" })
  );

  io.to(roomId).emit("receive-message", socket.id, message);
};

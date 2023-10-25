/**
 * Broadcasts a join message to all users in a room
 */
const broadcastJoin = async (socket, roomId, io, redis) => {
  console.log(`User ${socket.username} joined room ${roomId}`);
  const chatKey = `chat:${roomId}`;
  await redis.rpush(
    chatKey,
    JSON.stringify({
      senderId: socket.uuid,
      message: "has joined the room!",
      type: "announcement",
      username: socket.username,
    })
  );

  io.to(roomId).emit("user-joined", {
    userId: socket.uuid,
    message: "has joined the room!",
    username: socket.username,
  });
};

/**
 * Broadcasts a leave message to all users in a room
 */
const broadcastLeave = async (socket, roomId, io, redis) => {
  console.log(`User ${socket.username} left room ${roomId}`);
  const chatKey = `chat:${roomId}`;
  await redis.rpush(
    chatKey,
    JSON.stringify({
      senderId: socket.uuid,
      message: "has left the room.",
      type: "announcement",
      username: socket.username,
    })
  );

  io.to(roomId).emit("user-left", {
    userId: socket.uuid,
    message: "has left the room.",
    username: socket.username,
  });
};

/**
 * Broadcasts a message to all users in a room
 */
const sendMessage = async (socket, message, roomId, io, redis) => {
  console.log(
    `User ${socket.username} sent message: ${message} to room:${roomId}`
  );
  const chatKey = `chat:${roomId}`;
  await redis.rpush(
    chatKey,
    JSON.stringify({
      senderId: socket.uuid,
      message,
      type: "chat",
      username: socket.username,
    })
  );

  io.to(roomId).emit("receive-message", socket.uuid, message, socket.username);
};

module.exports = { broadcastJoin, broadcastLeave, sendMessage };

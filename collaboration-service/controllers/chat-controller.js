/**
 * Broadcasts a join message to all users in a room
 */
export const broadcastJoin = async (socket, roomId, io) => {
  console.log(`User ${socket.id} joined room ${roomId}`);
  io.to(roomId).emit("user-joined", {
    userId: socket.id,
    message: "has joined the room!",
  });
};

/**
 * Broadcasts a leave message to all users in a room
 */
export const broadcastLeave = async (socket, roomId, io) => {
  console.log(`User ${socket.id} left room ${roomId}`);
  io.to(roomId).emit("user-left", {
    userId: socket.id,
    message: "has left the room.",
  });
};

/**
 * Broadcasts a message to all users in a room
 */
export const sendMessage = async (socket, message, roomId, io) => {
  console.log(`User ${socket.id} sent message: ${message} to room:${roomId}`);
  io.to(roomId).emit("receive-message", socket.id, message);
};

import { broadcastLeave } from "./chat-controller.js";

const socketRoomMap = {}; // Will bring in DB later

/**
 * Connects socket to a room.
 */
export const setUpRoom = async (socket, roomId) => {
  console.log(`Setting up room ${roomId} for user ${socket.id}`);
  socket.join(roomId);
  socketRoomMap[socket.id] = roomId;
  socket.emit("room-is-ready");
};

/**
 * Disconnects socket from a room.
 */
export const disconnectFromRoom = async (socket, io) => {
  // Get the room ID associated with the socket
  const roomId = socketRoomMap[socket.id];

  if (roomId) {
    // Emit a farewell message to the room
    broadcastLeave(socket, roomId, io);
    socket.leave(roomId);
    delete socketRoomMap[socket.id];
  }
};

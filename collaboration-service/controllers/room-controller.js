import { broadcastLeave } from "./chat-controller.js";
import Room from "../model/room-model.js";

/**
 * Connects socket to a room.
 */
export const setUpRoom = async (socket, roomId) => {
  console.log(`Setting up room ${roomId} for user ${socket.id}`);
  const existingRoom = await Room.findOne({ room_id: roomId });

  if (existingRoom) {
    if (!existingRoom.users.includes(socket.id)) {
      existingRoom.users.push(socket.id);

      await Room.updateOne({ room_id: roomId }, { users: existingRoom.users });

      socket.join(roomId);
      socket.emit("room-is-ready");
    }
  } else {
    console.error("Failed to join socket to room:", err);
  }
};

/**
 * Disconnects socket from room
 */
export const leaveRoom = async (socket, roomId, io) => {
  console.log(`User ${socket.id} left room ${roomId}`);
  socket.leave(roomId);
  broadcastLeave(socket, roomId, io);
};

/**
 * Disconnects socket from a room. Socket leaves room upon disconnect.
 */
export const disconnectFromRoom = async (socket, io) => {
  const roomKeysIterator = socket.rooms.keys();

  for (const roomId of roomKeysIterator) {
    broadcastLeave(socket, roomId, io);
  }
};

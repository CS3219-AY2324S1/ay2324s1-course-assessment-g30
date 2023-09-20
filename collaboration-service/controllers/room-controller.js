import { broadcastLeave } from "./chat-controller.js";
import Room from "../model/room-model.js";

/**
 * Connects socket to a room and fetches the state of chat and editor for user
 */
export const setUpRoom = async (socket, roomId, redis) => {
  console.log(`Setting up room ${roomId} for user ${socket.id}`);
  const existingRoom = await Room.findOne({ room_id: roomId });

  if (existingRoom) {
    if (!existingRoom.users.includes(socket.id)) {
      existingRoom.users.push(socket.id);
      await Room.updateOne({ room_id: roomId }, { users: existingRoom.users });

      const chatKey = `chat:${roomId}`;
      const chatHistory = await redis.lrange(chatKey, 0, -1);
      const messages = chatHistory.map((message) => JSON.parse(message));

      socket.emit("chat-history", messages);

      socket.join(roomId);
      socket.emit("room-is-ready");
    }
  } else {
    socket.emit("invalid-room");
    console.error("Failed to join socket to room");
  }
};

/**
 * Disconnects socket from room
 */
export const leaveRoom = async (socket, roomId, io, redis) => {
  console.log(`User ${socket.id} left room ${roomId}`);
  socket.leave(roomId);
  broadcastLeave(socket, roomId, io, redis);
};

/**
 * Disconnects socket from a room. Socket leaves room upon disconnect.
 */
export const disconnectFromRoom = async (socket, io, redis) => {
  const roomKeysIterator = socket.rooms.keys();

  for (const roomId of roomKeysIterator) {
    broadcastLeave(socket, roomId, io, redis);
  }
};

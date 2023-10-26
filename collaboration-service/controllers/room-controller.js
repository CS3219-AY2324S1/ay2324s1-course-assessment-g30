const { broadcastLeave } = require("./chat-controller.js");
const Room = require("../model/room-model.js");

/**
 * Connects socket to a room and fetches the state of chat and editor for user
 */
const setUpRoom = async (socket, roomId) => {
  console.log(`Setting up room ${roomId} for user ${socket.username}`);
  const existingRoom = await Room.findOne({ room_id: roomId });

  if (existingRoom) {
    if (!existingRoom.users.includes(socket.uuid)) {
      existingRoom.users.push(socket.uuid);
      await Room.updateOne({ room_id: roomId }, { users: existingRoom.users });
    }

    socket.join(roomId);
    socket.emit("room-is-ready");
  } else {
    socket.emit("invalid-room");
    console.error("Failed to join socket to room");
  }
};

/**
 * Disconnects socket from room
 */
const leaveRoom = async (socket, roomId, io) => {
  console.log(`User ${socket.username} left room ${roomId}`);
  socket.leave(roomId);
  broadcastLeave(socket, roomId, io);
};

/**
 * Disconnects socket from a room. Socket leaves room upon disconnect.
 */
const disconnectFromRoom = async (socket, io) => {
  const roomKeysIterator = socket.rooms.keys();

  for (const roomId of roomKeysIterator) {
    broadcastLeave(socket, roomId, io);
  }
};

/**
 * Fetches room details for a given room
 */
const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.body;
    console.log(`Fetching room details for room ${roomId}`);

    const room = await Room.findOne({ room_id: roomId });

    if (!room) {
      return res
        .status(404)
        .json({ error: "Room Details not found for " + roomId });
    }

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { setUpRoom, leaveRoom, disconnectFromRoom, getRoomDetails };

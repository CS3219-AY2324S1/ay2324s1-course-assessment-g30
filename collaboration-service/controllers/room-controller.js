const { broadcastLeave } = require("./chat-controller.js");
const Room = require("../model/room-model.js");

/**
 * Connects socket to a room and fetches the state of editor for user
 */
const setUpRoom = async (socket, roomId, redis) => {
  console.log(`Setting up room ${roomId} for user ${socket.username}`);
  const existingRoom = await Room.findOne({ room_id: roomId });

  if (existingRoom) {
    if (!existingRoom.users.includes(socket.uuid)) {
      existingRoom.users.push(socket.uuid);
      await Room.updateOne({ room_id: roomId }, { users: existingRoom.users });
    }

    socket.join(roomId);
    // Fetch the initial editor state
    const editorKey = `editor:${roomId}`;
    const code = await redis.lindex(editorKey, 0);

    if (code != null) {
      socket.emit("sync-editor-state", code, roomId);
    } else {
      if (existingRoom.editor_state) {
        const editorState = JSON.stringify(existingRoom.editor_state);
        await redis.rpush(editorKey, editorState);
        socket.emit("sync-editor-state", editorState, roomId);
      }
    }

    socket.emit("room-is-ready");
  } else {
    socket.emit("invalid-room");
    console.error("Failed to join socket to room");
  }
};

/**
 * Disconnects socket from room
 */
const leaveRoom = async (socket, roomId, io, redis) => {
  console.log(`User ${socket.username} left room ${roomId}`);
  // Fetch from your redis server and store to DB here
  socket.leave(roomId);
  broadcastLeave(socket, roomId, io);
  saveStateToDb(roomId, redis);
};

/**
 * Disconnects socket from a room. Socket leaves room upon disconnect.
 */
const disconnectFromRoom = async (socket, io, redis) => {
  const roomKeysIterator = socket.rooms.keys();

  for (const roomId of roomKeysIterator) {
    broadcastLeave(socket, roomId, io);
    saveStateToDb(roomId, redis);
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

/**
 * Saves the state of the editor to mongoDB
 */
const saveStateToDb = async (roomId, redis) => {
  const editorKey = `editor:${roomId}`;
  const code = await redis.lindex(editorKey, 0);
  if (code != null) {
    console.log(`Saving editor state for room:${roomId}`);

    await Room.updateOne(
      { room_id: roomId },
      { editor_state: JSON.parse(code) }
    );
  }
};

/**
 * Fetch past attempts based on question and user id
 */
const getPastAttempts = async (req, res) => {
  try {
    const { questionId, uuid } = req.body;
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    console.log(`Fetching attempts of qid ${questionId} by ${uuid}`);

    const rooms = await Room.find({
      date_created: { $lt: twoHoursAgo },
      question_id: questionId,
      users: { $in: [uuid] },
    }).sort({ date_created: -1 });

    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

module.exports = {
  setUpRoom,
  leaveRoom,
  disconnectFromRoom,
  getRoomDetails,
  saveStateToDb,
  getPastAttempts,
};

/**
 *  push client code
 */
const pushCode = async (socket, code, roomId, io, redis) => {
  console.log(`User ${socket.username} pushed code to room:${roomId}`);
  socket.to(roomId).emit("push-code", code, roomId);
  const editorKey = `editor:${roomId}`;
  await redis.lpush(
      editorKey,
      JSON.stringify({
        code,
      })
  );
  // We only save 3 versions onto redis
  await redis.ltrim(editorKey,0,3)
  console.log("Changes saved to redis", code);
};

const syncState = async (socket, roomId, io, redis) => {
  // Fetch the editor state for the room from redis
  console.log(`User ${socket.username} requested state for room:${roomId}`);

  const editorKey = `editor:${roomId}`;
  const code = await redis.lindex(editorKey, 0);
  if (code == null) {
    socket.emit("sync-state", "", roomId);
  } else {
    socket.emit("sync-state", code, roomId);
  }
  //socket.to(roomId).emit("sync-state", state);
};

module.exports = { pushCode, syncState };

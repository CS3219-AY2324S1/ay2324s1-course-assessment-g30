/**
 *  push client code
 */
const pushCode = async (socket, code, roomId, io, redis) => {
  console.log(`User ${socket.username} pushed code ${code} to room:${roomId}`);
  const editorKey = `editor:${roomId}`;
  await redis.rpush(
    editorKey,
    JSON.stringify({
      code,
    })
  );

  socket.to(roomId).emit("push-code", code);
};

module.exports = { pushCode };

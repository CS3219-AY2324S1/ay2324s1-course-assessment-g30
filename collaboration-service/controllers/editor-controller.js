/**
 *  Broadcasts changes to code to users in a room
 */
const pushCode = async (socket, code, roomId, redis) => {
  //   console.log(`User ${socket.username} pushed code to room:${roomId}`);
  socket.to(roomId).emit("receive-code", code);
  const editorKey = `editor:${roomId}`;
  await redis.lpush(
    editorKey,
    JSON.stringify({
      code,
    })
  );
  // We only save 3 versions of the code onto redis
  await redis.ltrim(editorKey, 0, 3);
};

module.exports = { pushCode };

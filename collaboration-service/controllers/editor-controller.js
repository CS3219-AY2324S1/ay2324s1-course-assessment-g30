/**
 *  Broadcasts changes to code to users in a room
 */
const pushChanges = async (socket, changes, code, roomId, redis) => {
  socket.to(roomId).emit("receive-changes", changes, code);
  const editorKey = `editor:${roomId}`;
  // Push to redis
  await redis.lpush(
    editorKey,
    JSON.stringify({
      code,
    })
  );
  await redis.ltrim(editorKey, 0, 1);
};

module.exports = { pushChanges };

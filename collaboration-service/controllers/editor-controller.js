/**
 *  push client code
 */
export const pushCode = async (socket, code, roomId, io, redis) => {
    console.log(
        `User ${socket.username} pushed code ${code} to room:${roomId}`
    );
    const editorKey = `editor:${roomId}`;
    await redis.rpush(
        editorKey,
        JSON.stringify({
            senderId: socket.uuid,
            code,
            type: "editor",
            username: socket.username,
        })
    );

    socket.in(roomId).emit("push-code", socket.uuid, code, socket.username );
};

/**
 * update editor code
 */
export const syncCode = async (socket, code, roomId, io, redis) => {
  console.log(
    `User ${socket.username} editor is synced to:${roomId}`
  );
  const editorKey = `editor:${roomId}`;
  await redis.rpush(
      editorKey,
    JSON.stringify({
      senderId: socket.uuid,
        code,
      type: "editor",
      username: socket.username,
    })
  );

  io.to(roomId).emit("sync-code", socket.uuid, code, socket.username);
};

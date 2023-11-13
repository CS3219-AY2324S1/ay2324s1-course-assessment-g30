/**
 *  Language code from https://ce.judge0.com/languages/
 */
const LanguageCode = {
  "JavaScript": 63,
  "Python": 71,
  "Java": 62,
}

/**
 *  Broadcasts changes to code to users in a room
 */
const pushCode = async (socket, changes, code, roomId, redis) => {
  socket.to(roomId).emit("receive-code", changes);
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

/**
 *  Executes code
 */
const executeCode = (socket, roomId, http, post_options, get_options, code, stdin, language) => {
  let token = "";
  const submitReq = http.request(post_options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      //returnResult(socket, roomId, http, get_options(JSON.parse(body.toString()).token));
    });
  });

  submitReq.write(JSON.stringify({
    language_id: LanguageCode[language],
    source_code: code,
    stdin: stdin
  }));
  submitReq.end();

}

const returnResult = (socket, roomId, http, request) => {
  const reviewReq = http.request(request, function (res) {
    const chunks = [];
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
    res.on('end', function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      socket.to(roomId).emit("get-result", body.toString());
    });
  });
  reviewReq.end();
}

module.exports = { pushCode, executeCode };

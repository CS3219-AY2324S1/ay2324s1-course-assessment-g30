const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const {
  setUpRoom,
  disconnectFromRoom,
  leaveRoom,
  getRoomDetails,
} = require("./controllers/room-controller.js");
const {
  broadcastJoin,
  sendMessage,
} = require("./controllers/chat-controller.js");
const { connectToDB } = require("./model/db.js");
const { attemptToAuthenticate, auth } = require("./middleware/auth.js");
const WebSocket = require("ws");
const map = require("lib0/map");

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

// Middleware to authenticate user before allowing them to connect to socket.io server
io.use(async (socket, next) => {
  attemptToAuthenticate(socket, next);
});

// Run when client connects
io.on("connection", (socket) => {
  socket.uuid = socket.handshake.query.uuid;
  socket.username = socket.handshake.query.username;
  console.log(`User ${socket.username} connected`);

  socket.on("set-up-room", (roomId) => {
    setUpRoom(socket, roomId);
  });

  socket.on("join-room", (roomId) => {
    broadcastJoin(socket, roomId, io);
  });

  socket.on("leave-room", (roomId) => {
    leaveRoom(socket, roomId, io);
  });

  socket.on("send-message", (message, roomId) => {
    sendMessage(socket, message, roomId, io);
  });

  socket.on("disconnecting", async () => {
    disconnectFromRoom(socket, io);
  });

  socket.on("disconnect", () => {});

  socket.on("connect_error", (err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
    console.log(err.data); // { content: "Please retry later" }
  });
});

app.use(cors());
app.use(express.json());

app.post("/roomDetails", auth, getRoomDetails);

httpServer.listen(3004, () => {
  console.log("collaboration-service started on port 3004");
  connectToDB();
});

// Signalling
// const wsReadyStateConnecting = 0;
// const wsReadyStateOpen = 1;
// const wsReadyStateClosing = 2; // eslint-disable-line
// const wsReadyStateClosed = 3; // eslint-disable-line

// const pingTimeout = 30000;

// const wss = new WebSocket.Server({ noServer: true });

// const signalserver = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   response.end("okay");
// });

// /**
//  * Map froms topic-name to set of subscribed clients.
//  * @type {Map<string, Set<any>>}
//  */
// const topics = new Map();

// /**
//  * @param {any} conn
//  * @param {object} message
//  */
// const send = (conn, message) => {
//   if (
//     conn.readyState !== wsReadyStateConnecting &&
//     conn.readyState !== wsReadyStateOpen
//   ) {
//     conn.close();
//   }
//   try {
//     conn.send(JSON.stringify(message));
//   } catch (e) {
//     conn.close();
//   }
// };

// /**
//  * Setup a new client
//  * @param {any} conn
//  */
// const onconnection = (conn) => {
//   /**
//    * @type {Set<string>}
//    */
//   const subscribedTopics = new Set();
//   let closed = false;
//   // Check if connection is still alive
//   let pongReceived = true;
//   const pingInterval = setInterval(() => {
//     if (!pongReceived) {
//       conn.close();
//       clearInterval(pingInterval);
//     } else {
//       pongReceived = false;
//       try {
//         conn.ping();
//       } catch (e) {
//         conn.close();
//       }
//     }
//   }, pingTimeout);
//   conn.on("pong", () => {
//     pongReceived = true;
//   });
//   conn.on("close", () => {
//     subscribedTopics.forEach((topicName) => {
//       const subs = topics.get(topicName) || new Set();
//       subs.delete(conn);
//       if (subs.size === 0) {
//         topics.delete(topicName);
//       }
//     });
//     subscribedTopics.clear();
//     closed = true;
//   });
//   conn.on(
//     "message",
//     /** @param {object} message */ (message) => {
//       if (typeof message === "string") {
//         message = JSON.parse(message);
//       }
//       if (message && message.type && !closed) {
//         switch (message.type) {
//           case "subscribe":
//             /** @type {Array<string>} */ (message.topics || []).forEach(
//               (topicName) => {
//                 if (typeof topicName === "string") {
//                   // add conn to topic
//                   const topic = map.setIfUndefined(
//                     topics,
//                     topicName,
//                     () => new Set()
//                   );
//                   topic.add(conn);
//                   // add topic to conn
//                   subscribedTopics.add(topicName);
//                 }
//               }
//             );
//             break;
//           case "unsubscribe":
//             /** @type {Array<string>} */ (message.topics || []).forEach(
//               (topicName) => {
//                 const subs = topics.get(topicName);
//                 if (subs) {
//                   subs.delete(conn);
//                 }
//               }
//             );
//             break;
//           case "publish":
//             if (message.topic) {
//               const receivers = topics.get(message.topic);
//               if (receivers) {
//                 message.clients = receivers.size;
//                 receivers.forEach((receiver) => send(receiver, message));
//               }
//             }
//             break;
//           case "ping":
//             send(conn, { type: "pong" });
//         }
//       }
//     }
//   );
// };
// wss.on("connection", onconnection);

// signalserver.on("upgrade", (request, socket, head) => {
//   // You may check auth of request here..
//   /**
//    * @param {any} ws
//    */
//   const handleAuth = (ws) => {
//     wss.emit("connection", ws, request);
//   };
//   wss.handleUpgrade(request, socket, head, handleAuth);
// });

// signalserver.listen(3006);
// console.log("Signaling server running on localhost: 3006");

module.exports = { app };

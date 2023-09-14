import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { createClient } from 'redis';
import {
  setUpRoom,
  disconnectFromRoom,
} from "./controllers/room-controller.js";
import { broadcastJoin, sendMessage } from "./controllers/chat-controller.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const client = createClient();
client.on('error', console.error)
client
    .connect()
    .then(() => console.log(blueBright.bold('Connected to redis locally!')))
    .catch(() => {
      console.error(redBright.bold('Error connecting to redis'))
    })


// Run when client connects
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("set-up-room", (roomId) => {
    setUpRoom(socket, roomId);
  });

  socket.on("join-room", (roomId) => {
    broadcastJoin(socket, roomId, io);
  });

  socket.on("send-message", (message, roomId) => {
    sendMessage(socket, message, roomId, io);
  });

  socket.on("disconnect", async () => {
    disconnectFromRoom(socket, io);

    // TODO move to controller
    const { roomId, username } = await client.hGetAll(socket.id)
    const users = await client.lRange(`${roomId}:users`, 0, -1)
    const newUsers = users.filter((user) => username !== user)
    if (newUsers.length) {
      await client.del(`${roomId}:users`)
      await client.lPush(`${roomId}:users`, newUsers)
    } else {
      await client.del(`${roomId}:users`)
    }
  });

  socket.on('CODE_CHANGED', async (code) => {
    // TODO move to controller
    const { roomId, username } = await client.hGetAll(socket.id)
    const roomName = `ROOM:${roomId}`
    // io.emit('CODE_CHANGED', code)
    socket.to(roomName).emit('CODE_CHANGED', code)
  })
});

app.use(cors());
app.use(express.json());
app.post('/create-room', async (req, res) => {
  const { username } = req.body
  const roomId = v4()
  console.log('17err')
  await client
      .hSet(`${roomId}:info`, {
        created: moment(),
        updated: moment(),
      })
      .catch((err) => {
        console.error(1, err)
      })

  await client.lSet(`${roomId}:users`, [])

  res.status(201).send({ roomId })
})
httpServer.listen(3002, () => {
  console.log("collaboration-service started on port 3002");
});

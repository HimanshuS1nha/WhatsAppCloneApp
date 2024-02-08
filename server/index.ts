import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";

import { loginRouter } from "./routes/loginRouter";
import connectToDatabase from "./db";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { signupRouter } from "./routes/signupRouter";
import { getAllUsersRouter } from "./routes/getAllUsersRouter";
import Chats from "./models/ChatModel";
import { getAllChatsRouter } from "./routes/getAllChatsRouter";
import { editProfileRouter } from "./routes/editProfileRouter";
import { deleteChatsRouter } from "./routes/deleteChatsRouter";

const port = process.env.PORT || 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", async (req, res) => {
  res.json({ hello: "Hi" });
});

app.use(express.json());
app.use(cors());
app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/get-all-users", getAllUsersRouter);
app.use("/api/get-all-chats", getAllChatsRouter);
app.use("/api/edit-profile", editProfileRouter);
app.use("/api/delete-chats", deleteChatsRouter);

let users: { [key: string]: string } = {};
const rooms: { [key: string]: string[] } = {};

io.on("connection", (socket) => {
  users[socket.id] = socket.handshake.auth.id;
  socket.join(socket.handshake.auth.id);

  // Status
  socket.on("get-status", ({ id }) => {
    if (Object.values(users).includes(id)) {
      socket.emit("get-status", { status: "online" });
    }
  });

  socket.on("set-status", ({ to, status }) => {
    socket.to(to).emit("get-status", { status });
  });

  // Message
  socket.on("send-message", async ({ chats, id }) => {
    const messageObject = {
      message: chats.message,
      sentAt: chats.sentAt,
      sentTo: id,
      sentBy: users[socket.id],
      replyingTo: chats.replyingTo,
    };
    await Chats.create(messageObject);
    socket.to(id).emit("receive-message", messageObject);
  });

  socket.on("messages-seen", async ({ id, to }) => {
    await Chats.updateMany({ isSeen: false, sentTo: id }, { isSeen: true });
    socket.to(to).emit("messages-seen");
  });

  // VIDEO CALL
  socket.on("initiate-call", ({ id, name, image, to, type }) => {
    socket.to(to).emit("incoming-call", { id, name, image, type });
  });

  socket.on("join-room", (roomID) => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit("other-user", otherUser);
      socket.to(otherUser).emit("user-joined", socket.id);
    }
  });

  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });

  socket.on("end-call", ({ to }) => {
    socket.to(to).emit("end-call");
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    Object.keys(rooms).map((k) => {
      rooms[k].map((roomId, i) => {
        if (roomId === socket.id) {
          rooms[k].splice(i, 1);
        }
      });
    });
  });
});

app.use(errorMiddleware);
connectToDatabase().then(() => {
  server.listen(port, () => {
    console.log("Running");
  });
});

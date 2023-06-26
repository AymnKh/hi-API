import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import _ from "lodash";

const app = express();
// socket.io
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import User from "./helpers/userClass.js";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

import { createSocketStream } from "./socket/streams.js";
import { privateChat } from "./socket/private-chat.js";
createSocketStream(io, User, _);
privateChat(io);

//env
dotenv.config();

//body parser
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//cors
app.use(cors());
app.options("*", cors());

// connect to db
mongoose
  .connect(process.env.DATA_BASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to DB"); // if connection is successful
  })
  .catch((err) => {
    console.log(err); // if connection is unsuccessful
  });

//jwt middleware
import authJwt from "./helpers/jwt.js";
app.use(authJwt());

//auth middleware
import authRoutes from "./routes/auth.js";
app.use("/api", authRoutes);
//post middleware
import postRoutes from "./routes/post.js";
app.use("/api/posts", postRoutes);
//users middleware
import userRoutes from "./routes/users.js";
app.use("/api/users", userRoutes);
//friends middleware
import friendsRoutes from "./routes/friends.js";
app.use("/api/friends", friendsRoutes);
//message middleware
import messageRoutes from "./routes/message.js";
app.use("/api", messageRoutes);
//photo middleware
import photoRoutes from "./routes/photo.js";

app.use("/api", photoRoutes);

const port = 3000;

//connect to server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

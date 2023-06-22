import express from "express";

import { getAllMessages, markAllAsRead, sendMessage } from "../controllers/message.js";

const router = express.Router();

router.post("/chat-message/:senderId/:receiverId", sendMessage);
router.get("/chat-message/:senderId/:receiverId", getAllMessages);
router.get("/mark-message/:senderId/:receiverId", markAllAsRead);

export default router;

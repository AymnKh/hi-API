import express from "express";

import { getAllMessages, sendMessage } from "../controllers/message.js";

const router = express.Router();

router.post("/chat-message/:senderId/:recevierId", sendMessage);
router.get("/chat-message/:senderId/:recevierId", getAllMessages);

export default router;

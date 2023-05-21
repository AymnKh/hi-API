import express from "express";
import { addPost, getPosts } from "../controllers/post.js";

const router = express.Router();

router.post("/add", addPost);
router.get("/", getPosts);

export default router;
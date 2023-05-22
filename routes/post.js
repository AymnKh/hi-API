import express from "express";
import { addPost, getPosts, likePost } from "../controllers/post.js";

const router = express.Router();

router.post("/add", addPost);
router.post("/:postId", likePost);
router.get("/", getPosts);

export default router;
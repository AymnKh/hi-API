import express from "express";
import { addComment, addPost, getPost, getPosts, likePost } from "../controllers/post.js";

const router = express.Router();

router.post("/add", addPost);
router.post("/:postId", likePost);
router.get("/:postId", getPost);
router.get("/", getPosts);
router.post('/comment/:postId', addComment);

export default router;
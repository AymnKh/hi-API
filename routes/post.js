import express from "express";
import { addComment, addPost, deletePost, editPost, getPost, getPosts, likePost } from "../controllers/post.js";

const router = express.Router();

router.post("/add", addPost);
router.post("/:postId", likePost);
router.route("/:postId").get(getPost).delete(deletePost);
router.get("/", getPosts);
router.post('/comment/:postId', addComment);
router.put("/edit",editPost)

export default router;
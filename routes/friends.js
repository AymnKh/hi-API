import express from "express";
import { followUser, markAsReadOrDelete, unfollowUser } from "../controllers/friends.js";


const router = express.Router();

router.post("/follow-user", followUser);
router.post("/unfollow-user", unfollowUser);
router.post("/mark/:id", markAsReadOrDelete);

export default router;

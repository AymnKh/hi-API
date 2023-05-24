import express from "express";
import { followUser, unfollowUser } from "../controllers/friends.js";


const router = express.Router();

router.post("/follow-user", followUser);
router.post("/unfollow-user", unfollowUser);


export default router;

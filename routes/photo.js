import express from "express";
import { uploadPhoto, setProfile, deletePhoto } from "../controllers/photo.js";

const router = express.Router();

router.post("/upload-photo", uploadPhoto);
router.put("/set-profile/:photoId/:photoVersion", setProfile);
router.get("/delete-photo/:photoId", deletePhoto);

export default router;

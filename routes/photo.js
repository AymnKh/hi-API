import express from "express";
import { uploadPhoto } from "../controllers/photo.js";

const router = express.Router();

router.post("/upload-photo", uploadPhoto);

export default router;

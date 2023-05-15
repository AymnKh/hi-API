import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//body parser
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//cors
app.use(cors());
app.options("*", cors());

// connect to db
mongoose
  .connect(process.env.DATA_BASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to DB"); // if connection is successful
  })
  .catch((err) => {
    console.log(err); // if connection is unsuccessful
  });

//auth middleware
import authRoutes from "./routes/auth.js";
app.use("/api", authRoutes);

const port = 3000;

//connect to server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

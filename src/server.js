import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMongoDb from "./utils/db.js";
import User from "./models/user.model.js";
import { createError } from "./utils/apiError.js";
import authrouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authrouter);

connectMongoDb(process.env.MONGO_URI);

app.use((err, req, res, next) => {
  console.log();

  res.status(err.statusCode || 500).json({
    success: false,
    errorCode: err.code || "SERVER_ERROR",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log("server is up at port no", PORT);
});

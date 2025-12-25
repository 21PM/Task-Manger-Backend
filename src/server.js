import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMongoDb from "./utils/db.js";
import User from "./models/user.model.js";
import { createError } from "./utils/apiError.js";
import authrouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";
import cookieParser from "cookie-parser";
import protect from "./middlewares/auth.middleware.js";
dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Reflects the request origin, allowing all but avoiding the '*' wildcard issue
    credentials: true, // Required if you want to send/receive cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authrouter);
app.use("/task", protect, taskRouter);

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

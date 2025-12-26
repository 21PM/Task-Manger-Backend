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
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: true, // can add specific origin here but right now did't to test with any frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Add other headers in case needed in future currently ther is no need as we are saveing tokesn in cookiess
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authrouter);
app.use("/task", protect, taskRouter);

connectMongoDb(process.env.MONGO_URI);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    errorCode: err.code || "SERVER_ERROR",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log("server is up at port no", PORT);
});

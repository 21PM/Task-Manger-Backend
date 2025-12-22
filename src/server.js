import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMongoDb from "./utils/db.js";
import User from "./models/user.model.js";
import { createError } from "./utils/apiError.js";

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/auth", authRoutes);

app.post("/auth/login", async (req, res, next) => {
  console.log("request received");
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw createError(
      400,
      "VALIDATION_ERROR",
      "Email and password are required"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "AUTH_ERROR", "Invalid email or password");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError(401, "AUTH_ERROR", "Invalid email or password");
  }
  return res.json({ message: "login successfully" });
});

app.post("/auth/signup", (req, res, nex) => {
  console.log("signup   request received");

  return res.json({ message: "login called" });
});
connectMongoDb(process.env.MONGO_URI);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    errorCode: err.errorCode || "SERVER_ERROR",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log("server is up at port no", PORT);
});

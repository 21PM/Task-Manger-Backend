import express from "express";
import {
  login,
  signup,
  refresh,
  logout,
  checkAuth,
} from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const authrouter = express.Router();

authrouter.post("/login", login);
authrouter.post("/signup", signup);
authrouter.post("/refresh", refresh);
authrouter.post("/logout", logout);
authrouter.get("/me", protect, checkAuth);

export default authrouter;

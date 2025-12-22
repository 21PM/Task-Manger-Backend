import express from "express";
import { login, signup } from "../controllers/auth.controller.js";

const authrouter = express.Router();

authrouter.post("/login", login);
authrouter.post("/signup", signup);

export default authrouter;

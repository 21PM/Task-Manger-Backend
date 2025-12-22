import express from "express";
import { createTaskService } from "../services/task.service.js";

const taskRouter = express.Router();

taskRouter.post("/create", createTaskService);

export default taskRouter;

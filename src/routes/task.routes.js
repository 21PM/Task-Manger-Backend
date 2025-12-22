import express from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTasks,
} from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter.post("/create", createTask);
taskRouter.post("/edit/:taskId", editTask);
taskRouter.post("/delete/:taskId", deleteTask);
taskRouter.get("/get", getTasks);

export default taskRouter;

import express from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTasks,
  getTaskById,
} from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter.post("/create", createTask);
taskRouter.post("/edit/:taskId", editTask);
taskRouter.delete("/delete/:taskId", deleteTask);
taskRouter.get("/get", getTasks);
taskRouter.get("/get/:id", getTaskById);

export default taskRouter;

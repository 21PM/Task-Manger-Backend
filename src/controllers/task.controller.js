import {
  createTaskService,
  deleteTaskService,
  editTaskService,
  getTaskByIdService,
  getTasksService,
} from "../services/task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const result = await createTaskService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const editTask = async (req, res, next) => {
  try {
    const result = await editTaskService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    const result = await deleteTaskService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const result = await getTasksService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const result = await getTaskByIdService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

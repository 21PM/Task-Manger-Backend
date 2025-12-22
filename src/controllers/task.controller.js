import { createTaskService } from "../services/task.service";

export const createTask = async (req, res, next) => {
  try {
    const result = await createTaskService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

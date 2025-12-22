import { errorCodesText } from "../Constants/constants.errors.js";
import Task from "../models/task.model.js";
import { createError } from "../utils/apiError.js";

export const createTaskService = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;
    console.log({ title, description, status, priority });

    //  Validation
    if (!title || title.trim() === "") {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Title is required"
      );
    }

    //  Create task
    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      user: req.user._id,
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    //  Mongoose validation errors
    if (error.name === "ValidationError") {
      const statusCode = 400;
      throw createError(statusCode, errorCodesText[statusCode], error.message);
    }

    //  Fallback (Internal Server Error)
    const statusCode = 500;
    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "Something went wrong while creating the task"
    );
  }
};

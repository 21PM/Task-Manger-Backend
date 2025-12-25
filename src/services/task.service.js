import { errorCodesText } from "../Constants/constants.errors.js";
import Task from "../models/task.model.js";
import { createError } from "../utils/apiError.js";

export const createTaskService = async (req) => {
  try {
    console.log("req.body", req.body);
    const { title, description, status, priority, dueDate } = req.body;

    //  Validation
    if (!title || title.trim() === "") {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Title is required"
      );
    }
    console.log("before task creation", req.user._id);
    console.log(dueDate);

    //  Create task
    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });
    console.log("after task creation");

    // Success response
    return {
      success: true,
      message: "Task created successfully",
      data: task,
    };
  } catch (error) {
    console.log("error 40", error);

    //  Mongoose validation errors
    if (error.name === "ValidationError") {
      const statusCode = 400;
      throw createError(statusCode, errorCodesText[statusCode], error.message);
    }

    //  Fallback (Internal Server Error)
    const statusCode = 500;
    console.log(error);

    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "Something went wrong while creating the task"
    );
  }
};
export const editTaskService = async (req) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority } = req.body;

    // Validation: Check if taskId is provided
    if (!taskId) {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Task ID is required"
      );
    }

    // Validation: Optional, but good to check title if provided
    if (title && title.trim() === "") {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Title cannot be empty"
      );
    }

    // Find the task and ensure it belongs to the user
    const task = await Task.findOne({ _id: taskId, user: req.user._id });

    if (!task) {
      const statusCode = 404;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Task not found"
      );
    }

    // Update fields if they are provided
    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    // Save updated task
    const updatedTask = await task.save();

    // Success response
    return {
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    };
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const statusCode = 400;
      throw createError(statusCode, errorCodesText[statusCode], error.message);
    }

    // Fallback Internal Server Error
    const statusCode = 500;
    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "Something went wrong while updating the task"
    );
  }
};
export const deleteTaskService = async (req) => {
  try {
    const { taskId } = req.params;

    // Validation
    if (!taskId) {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Task ID is required"
      );
    }

    let task;

    // 🔐 Admin can delete any task
    if (req.user.role === "admin") {
      task = await Task.findById(taskId);
    } else {
      // 👤 User can delete only their own task
      task = await Task.findOne({
        _id: taskId,
        user: req.user._id,
      });
    }

    // Task not found
    if (!task) {
      const statusCode = 404;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Task not found or not authorized"
      );
    }

    // Delete task
    await task.deleteOne();

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    // Mongoose invalid ObjectId error
    if (error.name === "CastError") {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Invalid task ID"
      );
    }

    // Fallback error
    const statusCode = 500;
    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "Something went wrong while deleting the task"
    );
  }
};
export const getTasksService = async (req) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, priority, search, sort } = req.query;

    // Base filter
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };

    // Filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sort
    let sortBy = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split(":");
      sortBy = { [field]: order === "asc" ? 1 : -1 };
    }

    const tasks = await Task.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("user", "name email");

    const total = await Task.countDocuments(filter);

    return {
      success: true,
      data: tasks,
      pagination: {
        total,
        page,
        limit,
      },
    };
  } catch (error) {
    next(error);
  }
};

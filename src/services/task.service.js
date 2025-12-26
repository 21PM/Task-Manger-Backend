import { errorCodesText } from "../Constants/constants.errors.js";
import Task from "../models/task.model.js";
import { createError } from "../utils/apiError.js";

export const createTaskService = async (req) => {
  try {
    // console.log("req.body", req.body);
    const { title, description, status, priority, dueDate, assignee } =
      req.body;

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
      dueDate,
      assignee,
      user: req.user._id,
    });

    // Success response
    return {
      success: true,
      message: "Task created successfully",
      data: task,
    };
  } catch (error) {
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
    const { title, description, status, priority, assignee, dueDate } =
      req.body;

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
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignee !== undefined) task.assignee = assignee;

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
    if (req.user.role === "ADMIN") {
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
    const filter = req.user.role === "ADMIN" ? {} : { user: req.user._id };

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
      sortBy = {
        createdAt: sort === "asc" ? 1 : -1,
      };
    }

    // ✅ Build query
    let query = Task.find(filter).sort(sortBy).skip(skip).limit(limit);

    // ✅ Populate ONLY for admin
    if (req.user.role === "ADMIN") {
      query = query.populate("user", "name email");
    }

    const tasks = await query;

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
    throw error;
  }
};
export const getTaskByIdService = async (req) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id) {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Task id is required"
      );
    }

    // Find task
    const task = await Task.findById(id);

    if (!task) {
      const statusCode = 404;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Task not found"
      );
    }

    // Authorization check (important)
    if (task.user.toString() !== req.user._id.toString()) {
      const statusCode = 403;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "You are not allowed to view this task"
      );
    }

    return {
      success: true,
      message: "Task fetched successfully",
      data: task,
    };
  } catch (error) {
    // Invalid Mongo ObjectId
    if (error.name === "CastError") {
      const statusCode = 400;
      throw createError(
        statusCode,
        errorCodesText[statusCode],
        "Invalid task id"
      );
    }

    // Known errors
    if (error.statusCode) {
      throw error;
    }

    // Fallback
    const statusCode = 500;
    console.log(error);

    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "Something went wrong while fetching the task"
    );
  }
};

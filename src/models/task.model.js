import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["TODO", "IN PROGRESS", "DONE"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    dueDate: {
      type: Date,
      required: false, // optional
      validate: {
        validator: function (value) {
          if (!value) return true;
          // console.log(value);
          // 2025 - 12 - 26;
          // 2025-12-26T00:00:00.000Z
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dueDate = new Date(value);
          dueDate.setHours(0, 0, 0, 0);
          console.log(" dueDate >= today", dueDate >= today);
          return dueDate >= today;
        },
        message: "Due date cannot be in the past",
      },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;

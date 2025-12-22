import { errorCodeMessage } from "../Constants/constants.errors";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "Unexpected server error",
      details: err.details || [],
    },
  });
};

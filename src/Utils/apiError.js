export const createError = (statusCode, code, message, details = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.message = message;
  error.details = details;
  return error;
};

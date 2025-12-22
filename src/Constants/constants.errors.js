// • Return 400 for invalid payloads
// • Return 401 for missing/invalid JWT
// • Return 403 for role-based denial
// • Return 404 if task not found
// • Return 500 for unexpected errors

export const errorCodesText = {
  400: "INVALID_PAYLOAD",
  401: "TOKEN_EXPIRED",
  403: "ACCESS_DENIED",
  404: "NOT_FOUND",
  400: "INTERNAL_ERROR",
  409: "USER_ALREADY_EXIST",
  500: "INTERNAL_SERVER_ERROR",
};

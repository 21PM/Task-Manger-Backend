import { createError } from "../utils/apiError.js";
import { errorCodesText } from "../Constants/constants.errors";
import User from "../models/user.model";
export const loginService = async (email, password) => {
  if (!email || !password) {
    throw createError(
      400,
      errorCodesText[400],
      "Email and password are required"
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, errorCodesText[401], "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError(401, errorCodesText[401], "Invalid email or password");
  }

  return {
    message: "Login successful",
    userId: user._id,
  };
};

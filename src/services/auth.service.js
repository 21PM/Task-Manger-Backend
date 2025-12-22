import { createError } from "../utils/apiError.js";
import { errorCodesText } from "../Constants/constants.errors.js";
import User from "../models/user.model.js";
export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw createError(
      400,
      errorCodesText[400],
      "Email and password are required"
    );
  }
  console.log("isValid user");

  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, errorCodesText[401], "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  console.log("IsMatch", isMatch);

  if (!isMatch) {
    throw createError(401, errorCodesText[401], "Invalid email or password");
  }

  return {
    message: "Login successful",
    userId: user._id,
  };
};

export const signupService = async ({ email, password, name }) => {
  // Normalize input
  email = email?.trim().toLowerCase();
  name = name?.trim();

  // Validation
  if (!email || !password || !name) {
    const statusCode = 400;
    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "Email, password and name are required"
    );
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const statusCode = 409;
    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "User already registered with this email, please login"
    );
  }

  // Create user
  const newUser = await User.create({ name, email, password });

  return {
    message: "Signup successful",
    userId: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

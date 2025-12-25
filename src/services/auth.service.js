import { createError } from "../utils/apiError.js";
import { errorCodesText } from "../Constants/constants.errors.js";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../Utils/jwt.js";
export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw createError(
      400,
      errorCodesText[400],
      "Email and password are required"
    );
  }
  // console.log("isValid user");

  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, errorCodesText[404], "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  // console.log("IsMatch", isMatch);

  if (!isMatch) {
    throw createError(401, errorCodesText[401], "Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user._id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  // store refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();
  console.log("user", user);

  return {
    userDetails: {
      name: user.name,
      email: user.email,
      id: user._id,
      role: user.role,
    },
    accessToken,
    refreshToken,
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

export const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(401, "AUTH_ERROR", "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw createError(401, "AUTH_ERROR", "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw createError(401, "AUTH_ERROR", "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({
    id: user._id,
    email: user.email,
  });

  return { accessToken: newAccessToken };
};

export const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    const statusCode = 400;
    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "No refresh token provided"
    );
  }

  const user = await User.findOne({ refreshToken });

  if (!user) {
    const statusCode = 401;
    throw createError(
      statusCode,
      errorCodesText[statusCode],
      "Invalid refresh token"
    );
  }
  user.refreshToken = null;
  await user.save();

  return { message: "Logged out successfully" };
};

export const checkAuthController = async (req) => {
  // console.log("check auth req received");

  const user = await User.findById(req.user._id).select("_id name email role");

  if (!user) {
    const statusCode = 401;
    throw createError(statusCode, errorCodesText[statusCode], "User not found");
  }

  return { user };
};

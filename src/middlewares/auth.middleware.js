import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { createError } from "../utils/apiError.js";
const protect = async (req, res, next) => {
  // console.log("req recived on middleware");

  try {
    //  Get access token from cookies
    const accessToken = req.cookies?.accessToken;
    // console.log("accessToken", accessToken);

    if (!accessToken) {
      return next(createError(401, "AUTH_ERROR", "Access token missing"));
    }

    //  Verify access token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return next(
        createError(401, "AUTH_ERROR", "Invalid or expired access token")
      );
    }

    // Get user from DB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(createError(401, "AUTH_ERROR", "User not found"));
    }
    // console.log("USER",user);
    console.log("middleware passed");

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
export default protect;

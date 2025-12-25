import {
  checkAuthController,
  loginService,
  logoutService,
  refreshService,
  signupService,
} from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, userDetails } = await loginService(
      req.body
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      userDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const result = await signupService(req.body);
    console.log("resilt", result);

    res.status(200).json(result);
  } catch (error) {
    console.log("resilt error", error);

    next(error);
  }
};
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await refreshService(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await logoutService(refreshToken);
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (req, res, next) => {
  console.log("auth req received");

  try {
    const result = await checkAuthController(req);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "Login successful",
      userDetails: result.user,
    });
  } catch (error) {
    next(error);
  }
};

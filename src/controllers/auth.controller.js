import {
  loginService,
  logoutService,
  refreshService,
  signupService,
} from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginService(req.body);

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

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

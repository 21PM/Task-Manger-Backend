import { loginService, signupService } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
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

import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { User } from "@/models/user.model.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    next();
  } catch (error) {
    return next(error);
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });
    const isAdmin = user?.role === "admin";
    if (!isAdmin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    next();
  } catch (error) {
    return next(error);
  }
};

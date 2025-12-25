import { NextFunction, Request, Response } from "express";
import { User } from "@/models/user.model.js";
import { getAuth } from "@clerk/express";

export const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find current user id (clerk id)
    const { userId } = getAuth(req);

    // find all users except the current user
    const users = await User.find({ clerkId: { $ne: userId } }); // ne -> not equal

    // return users
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

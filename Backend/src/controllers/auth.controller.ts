import { Request, Response, NextFunction } from "express";
import { User } from "@/models/user.model.js";

export const authCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user already exists
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      // signup flow
      const newUser = await User.create({
        clerkId: id,
        role: "user",
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    }

    // login flow
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

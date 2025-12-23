import { Request, Response } from "express";
import { User } from "@/models/user.model.js";

export const authCallbackController = async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user already exists
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      // signup flow
      const newUser = await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });

      return res.status(201).json({
        success: true,
        user: newUser,
      });
    }

    // login flow
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

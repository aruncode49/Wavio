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
        role: "user",
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
      return res.success(newUser, "User created successfully", 201);
    }

    // login flow
    return res.success(user, "User logged in successfully", 200);
  } catch (error) {
    return res.error();
  }
};

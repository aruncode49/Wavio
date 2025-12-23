import { NextFunction, Request, Response } from "express";

export const responseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.success = (data?: any, message?: string, statusCode?: number) => {
    return res.status(statusCode || 200).json({
      success: true,
      data,
      message,
    });
  };

  res.error = (message?: string, statusCode?: number, error?: any) => {
    return res.status(statusCode || 500).json({
      success: false,
      message: message || "Internal Server Error",
      error,
    });
  };

  next();
};

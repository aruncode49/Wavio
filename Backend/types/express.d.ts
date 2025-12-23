import "express";

declare module "express-serve-static-core" {
  interface Response {
    success: (data?: any, message?: string, statusCode?: number) => Response;
    error: (message?: string, statusCode?: number, error?: any) => Response;
  }
}

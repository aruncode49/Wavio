import dotenv from "dotenv";
dotenv.config();

// lib imports
import express, { Request, Response, NextFunction } from "express";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";

// app imports
import { connectToDB } from "@/lib/db.js";
import userRoutes from "@/routes/user.routes.js";
import albumRoutes from "@/routes/album.routes.js";
import authRoutes from "@/routes/auth.routes.js";
import songRoutes from "@/routes/song.routes.js";
import statsRoutes from "@/routes/stats.routes.js";

// app instance
const app = express();
const PORT = process.env.PORT;
const __dirname = process.cwd();

// app middlewares
app.use(express.json());
app.use(clerkMiddleware());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
    abortOnLimit: true,
  })
);

// app routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/album", albumRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/song", songRoutes);
app.use("/api/v1/stats", statsRoutes);

// app error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// app server
app.listen(PORT, () => {
  connectToDB();
  console.log(`Server running on port ${PORT}`);
});

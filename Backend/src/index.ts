import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import userRoutes from '@/routes/user.routes.js'
import adminRoutes from '@/routes/admin.routes.js'
import albumRoutes from '@/routes/album.routes.js'
import authRoutes from '@/routes/auth.routes.js'
import songRoutes from '@/routes/song.routes.js'
import statisticsRoutes from '@/routes/statistics.routes.js'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/album", albumRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/song", songRoutes)
app.use("/api/statistics", statisticsRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
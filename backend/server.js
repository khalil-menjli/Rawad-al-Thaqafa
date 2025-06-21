import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import path from 'path';

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import offersRoutes from "./modules/offers Cultural/offers.routes.js";
import tasksRoutes from "./modules/tasks/tasks.routes.js"
import { db } from "./database/db.js";



dotenv.config();
const app = express();
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(cors({ origin: "http://localhost:5173",credentials: true }));
app.use(express.json());
app.use(cookieParser()); 

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/tasks", tasksRoutes);


app.listen(3000, '0.0.0.0', () => {
    db();
    console.log("server is running on port 3000");
});

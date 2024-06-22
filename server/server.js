import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRouter from "./routes/authRouter.js";
import { notFound, errorHandle } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db-connect.js";
dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "public")));

connectDB();

app.use("/api/v1", authRouter);
app.use(notFound);
app.use(errorHandle);

app.listen(port, console.log(`Server listening on port ${port}`));

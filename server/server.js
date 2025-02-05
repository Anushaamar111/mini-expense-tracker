import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoute.js";
import expenseRoutes from "./routes/expenseRoute.js";

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
const PORT = process.env.PORT || 8000;
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

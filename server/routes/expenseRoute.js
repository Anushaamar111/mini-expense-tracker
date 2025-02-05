import express from "express";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "../controller/expenseController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", authenticateUser,getExpenses);
router.post("/", authenticateUser ,addExpense);
router.put("/:id",authenticateUser ,updateExpense);
router.delete("/:id", authenticateUser,deleteExpense);

export default router;
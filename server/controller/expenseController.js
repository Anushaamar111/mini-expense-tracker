import Expense from "../models/expense.js";

// Get all expenses with pagination and filtering
export const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const userId = req.user.id;

    const query = { userId };
    if (category) query.category = category;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalExpenses = await Expense.countDocuments(query);
    const totalPages = Math.ceil(totalExpenses / limit);

    res.json({ expenses, totalPages });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new expense
export const addExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    const userId = req.user.id;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Amount, category, and date are required" });
    }

    const newExpense = new Expense({ userId, amount, category, date, description });
    await newExpense.save();

    res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Ensure user is authenticated
    const { amount, category, description } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId }, 
      { amount, category, description }, 
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.json({ message: "Expense updated successfully", expense: updatedExpense });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log("Deleting expense ID:", id, "for user:", userId); // Debugging log

    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

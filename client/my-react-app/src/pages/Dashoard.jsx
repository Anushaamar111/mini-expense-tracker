import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  const API_URL = "http://localhost:8000/api/expenses";
  const itemsPerPage = 10;

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL, {
        params: {
          page,
          limit: itemsPerPage,
          category: filterCategory,
          startDate,
          endDate,
        },
        withCredentials: true,
      });
      setExpenses(data.expenses || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      const categoryTotals = data.expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});
      setChartData(
        Object.entries(categoryTotals).map(([cat, total]) => ({
          category: cat,
          total,
        }))
      );
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchChartData();
  }, [page, filterCategory, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );
      fetchChartData();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setForm({
      category: expense.category,
      amount: expense.amount,
      date: expense.date ? expense.date.substring(0, 10) : "",
      description: expense.description || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editExpense) return;
    try {
      const { data } = await axios.put(`${API_URL}/${editExpense._id}`, form, {
        withCredentials: true,
      });
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === data.expense._id ? data.expense : expense
        )
      );
      setEditExpense(null);
      fetchChartData();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(API_URL, form, {
        withCredentials: true,
      });
      setExpenses((prev) => [data.expense, ...prev]);
      fetchChartData();
      setShowAddForm(false);
      setForm({ category: "", amount: "", date: "", description: "" });
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Expense
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
        <div className="bg-white p-4 rounded-lg shadow h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg mt-6 p-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <div className="flex flex-wrap gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="">All</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg mt-6">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between">
            <h3 className="text-lg font-medium">Recent Expenses</h3>
          </div>
          <div className="overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No expenses found
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <li
                    key={expense._id}
                    className="px-4 py-4 flex justify-between sm:px-6"
                  >
                    <div>
                      <p className="text-gray-900">
                        {expense.description} - ₹{expense.amount}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(expense.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Category: {expense.category}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border text-sm rounded-md bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="ml-3 px-4 py-2 border text-sm rounded-md bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-2 py-2 border rounded-l-md bg-white text-sm hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-2 py-2 border rounded-r-md bg-white text-sm hover:bg-gray-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAdd}
            className="bg-white p-4 rounded-lg shadow mt-6"
          >
            <h2 className="text-lg font-semibold">Add Expense</h2>
            <label className="block mt-2">Category:</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border p-2 rounded-md w-full"
              required
            />
            <label className="block mt-2">Amount:</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border p-2 rounded-md w-full"
              required
            />
            <label className="block mt-2">Date:</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 rounded-md w-full"
              required
            />
            <label className="block mt-2">Description:</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border p-2 rounded-md w-full"
            />
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {editExpense && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-4 rounded-lg shadow mt-6"
          >
            <h2 className="text-lg font-semibold">Edit Expense</h2>
            <label className="block mt-2">Category:</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border p-2 rounded-md w-full"
            />
            <label className="block mt-2">Amount:</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border p-2 rounded-md w-full"
            />
            <label className="block mt-2">Date:</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 rounded-md w-full"
            />
            <label className="block mt-2">Description:</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border p-2 rounded-md w-full"
            />
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditExpense(null)}
                className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

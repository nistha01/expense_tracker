import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setFormisOpen } from "../auth/authSlice";
import { ref, push, get, remove } from "firebase/database";
import { database } from "../auth/FireBaseConfig";
import { toast } from 'react-toastify';

const HomePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ date: "", description: "", amount: "", category: "" });
  const [filterCategory, setFilterCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const globalDispatch = useDispatch();
  const isFormOpen = useSelector((state) => state.auth.isFormOpen);
  const email = useSelector((state) => state.auth.gmail);

  useEffect(() => {
    fetchExpenses();
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    globalDispatch(setLogin(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formattedEmail = email.replace(/\./g, "_");
    const expensesRef = ref(database, `expenses/${formattedEmail}`);
    const expenseToSave = { ...newExpense, amount: parseFloat(newExpense.amount) };

    try {
      await push(expensesRef, expenseToSave);
      toast.success("Saved successfully!");
      setNewExpense({ date: "", description: "", amount: "", category: "" });
      fetchExpenses();
      globalDispatch(setFormisOpen(false));
    } catch (error) {
      alert("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    const formattedEmail = email.replace(/\./g, "_");
    const expenseRef = ref(database, `expenses/${formattedEmail}/${id}`);

    try {
      await remove(expenseRef);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedExpense = { ...newExpense, amount: parseFloat(newExpense.amount) };

    setExpenses((prev) =>
      prev.map((expense) => (expense.id === editingExpense.id ? updatedExpense : expense))
    );

    setIsEditing(false);
    setEditingExpense(null);
    setNewExpense({ date: "", description: "", amount: "", category: "" });
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const fetchExpenses = async () => {
    try {
      const formattedEmail = email.replace(/\./g, "_");
      const expensesRef = ref(database, `expenses/${formattedEmail}`);
      const snapshot = await get(expensesRef);

      if (snapshot.exists()) {
        const fetchedExpenses = snapshot.val();
        const formattedExpenses = Object.keys(fetchedExpenses).map((key) => ({
          id: key,
          ...fetchedExpenses[key],
        }));
        setExpenses(formattedExpenses);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const filteredExpenses = filterCategory
    ? expenses.filter((expense) => expense.category === filterCategory)
    : expenses;

  return (
    <div className="homepage">
      <header className="homepage-header">
        <Link to="/profile">
          <button className="profile-btn">My Profile</button>
        </Link>
        <h1>Track Your Expense</h1>
        <div className="right-corner">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="homepage-content">
        <button className="add-expense-btn" onClick={() => globalDispatch(setFormisOpen(true))}>
          Add Expense
        </button>

        <div className="filter-container">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select id="category-filter" value={filterCategory} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Food">Food</option>
            <option value="Utilities">Utilities</option>
            <option value="Transportation">Transportation</option>
            <option value="Health">Health</option>
          </select>
        </div>

        {filteredExpenses.length > 0 ? (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.description}</td>
                  <td>₹{expense.amount.toFixed(2)}</td>
                  <td>{expense.category}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setIsEditing(true);
                        setEditingExpense(expense);
                        setNewExpense(expense);
                        globalDispatch(setFormisOpen(true));
                      }}
                    >
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteExpense(expense.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses recorded yet.</p>
        )}

        {isFormOpen && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h2>{isEditing ? "Edit Expense" : "Add New Expense"}</h2>
              <button className="circular-btn" onClick={() => globalDispatch(setFormisOpen(false))}>
                x
              </button>
              <form onSubmit={isEditing ? handleEditSubmit : handleFormSubmit}>
                <label>
                  Date:
                  <input type="date" name="date" value={newExpense.date} onChange={handleInputChange} required />
                </label>
                <label>
                  Description:
                  <input type="text" name="description" value={newExpense.description} onChange={handleInputChange} required />
                </label>
                <label>
                  Amount:
                  <input type="number" name="amount" value={newExpense.amount} onChange={handleInputChange} required />
                </label>
                <label>
                  Category:
                  <select name="category" value={newExpense.category} onChange={handleInputChange} required>
                    <option value="">-- Select a Category --</option>
                    <option value="Food">Food</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Health">Health</option>
                  </select>
                </label>
                <div className="form-buttons">
                  <button type="submit">{isEditing ? "Update Expense" : "Add Expense"}</button>
                  <button
                    type="button"
                    onClick={() => {
                      globalDispatch(setFormisOpen(false));
                      setNewExpense({ date: "", description: "", amount: "", category: "" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;

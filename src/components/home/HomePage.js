import React, { useContext, useState } from "react";
import "./HomePage.css";
import { AuthContext } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { setIsLogin } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([
    { id: 1, date: "2024-11-01", description: "Groceries", amount: 50, category: "Food" },
    { id: 2, date: "2024-11-05", description: "Electricity Bill", amount: 100, category: "Utilities" },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
  });
  const [filterCategory, setFilterCategory] = useState("");

  const handleLogout = () => {
    setIsLogin(false);
  };

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setNewExpense({ date: "", description: "", amount: "", category: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const expenseToAdd = {
      ...newExpense,
      id: expenses.length + 1,
      amount: parseFloat(newExpense.amount),
    };
    setExpenses((prev) => [...prev, expenseToAdd]);
    handleFormClose();
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setNewExpense(expense);
    setIsEditFormOpen(true);
  };

  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
    setEditingExpense(null);
    setNewExpense({ date: "", description: "", amount: "", category: "" });
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === editingExpense.id
          ? { ...editingExpense, ...newExpense, amount: parseFloat(newExpense.amount) }
          : expense
      )
    );
    handleEditFormClose();
  };

  const handleDeleteClick = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value);
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
        <button className="add-expense-btn" onClick={handleFormOpen}>
          Add Expense
        </button>

        <div className="filter-container">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select id="category-filter" value={filterCategory} onChange={handleCategoryFilter}>
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
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>{expense.category}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(expense)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(expense.id)}>
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
              <h2>Add New Expense</h2>
              <button className="circular-btn" onClick={handleFormClose}>
                x
              </button>
              <form onSubmit={handleFormSubmit}>
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
                  <button type="submit">Add Expense</button>
                  <button type="button" onClick={handleFormClose}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditFormOpen && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h2>Edit Expense</h2>
              <button className="circular-btn" onClick={handleEditFormClose}>
                x
              </button>
              <form onSubmit={handleEditFormSubmit}>
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
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={handleEditFormClose}>
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

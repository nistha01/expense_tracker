import React, { useReducer } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setFormisOpen } from "../auth/authSlice";

// Initial state for the reducer
const initialState = {
  expenses: [
    { id: 1, date: "2024-11-01", description: "Groceries", amount: 50, category: "Food" },
    { id: 2, date: "2024-11-05", description: "Electricity Bill", amount: 100, category: "Utilities" },
  ],
  isEditFormOpen: false,
  editingExpense: null,
  newExpense: { date: "", description: "", amount: "", category: "" },
  filterCategory: "",
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NEW_EXPENSE":
      return {
        ...state,
        newExpense: { ...state.newExpense, [action.payload.name]: action.payload.value },
      };
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        newExpense: { date: "", description: "", amount: "", category: "" },
      };
    case "SET_EDITING_EXPENSE":
      return {
        ...state,
        isEditFormOpen: true,
        editingExpense: action.payload,
        newExpense: { ...action.payload },
      };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === state.editingExpense.id
            ? { ...action.payload }
            : expense
        ),
        isEditFormOpen: false,
        editingExpense: null,
        newExpense: { date: "", description: "", amount: "", category: "" },
      };
      case "CLOSE_EDITING_FORM":
      return {
        ...state,
        isEditFormOpen: false,
        editingExpense: null,
        newExpense: { date: "", description: "", amount: "", category: "" },
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case "SET_FILTER_CATEGORY":
      return { ...state, filterCategory: action.payload };
    default:
      return state;
  }
};

const HomePage = () => {
  const [state, dispatchLocal] = useReducer(reducer, initialState);
  const globalDispatch = useDispatch();
  const isFormOpen = useSelector((state) => state.auth.isFormOpen);

  const handleLogout = () => {
    globalDispatch(setLogin(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatchLocal({ type: "SET_NEW_EXPENSE", payload: { name, value } });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      ...state.newExpense,
      id: state.expenses.length + 1,
      amount: parseFloat(state.newExpense.amount),
    };
    dispatchLocal({ type: "ADD_EXPENSE", payload: newExpense });
    globalDispatch(setFormisOpen(false));
  };
  const handleFormClose=()=>{
    globalDispatch(setFormisOpen(false));
  }

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    const updatedExpense = {
      ...state.newExpense,
      amount: parseFloat(state.newExpense.amount),
    };
    dispatchLocal({ type: "UPDATE_EXPENSE", payload: updatedExpense });
  };
  const handleEditFormClose=()=>{
    
  }
  

  const handleDeleteClick = (id) => {
    dispatchLocal({ type: "DELETE_EXPENSE", payload: id });
  };

  const handleCategoryFilter = (e) => {
    dispatchLocal({ type: "SET_FILTER_CATEGORY", payload: e.target.value });
  };

  const filteredExpenses = state.filterCategory
    ? state.expenses.filter((expense) => expense.category === state.filterCategory)
    : state.expenses;

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
          <select id="category-filter" value={state.filterCategory} onChange={handleCategoryFilter}>
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
                    <button className="edit-btn" onClick={() => dispatchLocal({ type: "SET_EDITING_EXPENSE", payload: expense })}>
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
                  <input type="date" name="date" value={state.newExpense.date} onChange={handleInputChange} required />
                </label>
                <label>
                  Description:
                  <input type="text" name="description" value={state.newExpense.description} onChange={handleInputChange} required />
                </label>
                <label>
                  Amount:
                  <input type="number" name="amount" value={state.newExpense.amount} onChange={handleInputChange} required />
                </label>
                <label>
                  Category:
                  <select name="category" value={state.newExpense.category} onChange={handleInputChange} required>
                    <option value="">-- Select a Category --</option>
                    <option value="Food">Food</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Health">Health</option>
                  </select>
                </label>
                <div className="form-buttons">
                  <button type="submit">Add Expense</button>
                  <button type="button" onClick={() => globalDispatch(setFormisOpen(false))}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {state.isEditFormOpen && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h2>Edit Expense</h2>
              <button className="circular-btn" onClick={handleEditFormClose}>
                x
              </button>
              <form onSubmit={handleEditFormSubmit}>
                <label>
                  Date:
                  <input type="date" name="date" value={state.newExpense.date} onChange={handleInputChange} required />
                </label>
                <label>
                  Description:
                  <input type="text" name="description" value={state.newExpense.description} onChange={handleInputChange} required />
                </label>
                <label>
                  Amount:
                  <input type="number" name="amount" value={state.newExpense.amount} onChange={handleInputChange} required />
                </label>
                <label>
                  Category:
                  <select name="category" value={state.newExpense.category} onChange={handleInputChange} required>
                    <option value="">-- Select a Category --</option>
                    <option value="Food">Food</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Health">Health</option>
                  </select>
                </label>
                <div className="form-buttons">
                  <button type="submit">Update Expense</button>
                  <button type="button" onClick={() => dispatchLocal({ type: "SET_EDITING_EXPENSE", payload: null })}>
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

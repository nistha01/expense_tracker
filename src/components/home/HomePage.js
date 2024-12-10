import React, { useReducer, useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setFormisOpen, gmail } from "../auth/authSlice";
import { ref, push, get,remove } from "firebase/database";
import { database } from "../auth/FireBaseConfig";


const initialState = {
  expenses: [],
  isEditFormOpen: false,
  editingExpense: null,
  newExpense: { date: "", description: "", amount: "", category: "" },
  filterCategory: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NEW_EXPENSE":
      return {
        ...state,
        newExpense: { ...state.newExpense, [action.payload.name]: action.payload.value },
      };
    // case "ADD_EXPENSE":
    //   return {
    //     ...state,
    //     expenses: [...state.expenses, action.payload],
    //     newExpense: { date: "", description: "", amount: "", category: "" },
    //   };
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
          expense.id === state.editingExpense.id ? { ...action.payload } : expense
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
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    default:
      return state;
  }
};

const HomePage = () => {
  const [state, dispatchLocal] = useReducer(reducer, initialState);
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
    dispatchLocal({ type: "SET_NEW_EXPENSE", payload: { name, value } });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newExpense = {
      ...state.newExpense,
      amount: parseFloat(state.newExpense.amount),
    };
    try {
      const formattedEmail = email.replace(/\./g, "_");
      const expensesRef = ref(database, `expenses/${formattedEmail}`);
      await push(expensesRef, newExpense);
      alert("Expense added successfully!");
      fetchExpenses();
      dispatchLocal({
        type: "SET_NEW_EXPENSE",
        payload: { date: "", description: "", amount: "", category: "" },
      });
      globalDispatch(setFormisOpen(false));
    } catch (error) {
      alert("Error adding expense:", error);
    }
  };

  const handleDeleteClickk = (id) => {
    const formattedEmail = email.replace(/\./g, "_");
    const expenseRef = ref(database, `expenses/${formattedEmail}/${id}`);
    remove(expenseRef)
      .then(() => {
        console.log("Expense deleted successfully!");
        dispatchLocal({ type: "DELETE_EXPENSE", payload: id });
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
      });
  };
  const handleFormClose = () => {
    globalDispatch(setFormisOpen(false));
  };
  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    const updatedExpense = {
      ...state.newExpense,
      amount: parseFloat(state.newExpense.amount),
    };
    dispatchLocal({ type: "UPDATE_EXPENSE", payload: updatedExpense });
  };

  const handleDeleteClick = (id) => {
    dispatchLocal({ type: "DELETE_EXPENSE", payload: id });
  };

  const handleCategoryFilter = (e) => {
    dispatchLocal({ type: "SET_FILTER_CATEGORY", payload: e.target.value });
  };

  const filteredExpenses = state.filterCategory
    ? state.expenses.filter((expense) => expense.category === state.filterCategory)
    : state.expenses;

  const fetchExpenses = async () => {
    try {
      const formattedEmail = email.replace(/\./g, "_");
      const expensesRef = ref(database, `expenses/${formattedEmail}`);
      const snapshot = await get(expensesRef);

      if (snapshot.exists()) {
        const expenses = snapshot.val();
        const formattedExpenses = Object.keys(expenses).map((key) => ({
          id: key, 
          ...expenses[key],
        }));

        dispatchLocal({ type: "SET_EXPENSES", payload: formattedExpenses });
      } else {
        dispatchLocal({ type: "SET_EXPENSES", payload: [] });
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

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
                  <td>₹{expense.amount.toFixed(2)}</td>
                  <td>{expense.category}</td>
                  <td>
                    <button className="edit-btn" onClick={() => dispatchLocal({ type: "SET_EDITING_EXPENSE", payload: expense })}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClickk(expense.id)}>
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
      </main>
    </div>
  );
};

export default HomePage;

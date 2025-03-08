import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseTracking.css"; // Import custom styles

const ExpenseTracking = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user) fetchExpenses(); // Ensure user is defined before making API call
  }, [user]);

  const fetchExpenses = () => {
    if (!user) return; // Prevent error if user is undefined

    axios
      .get(`https://craftipro.com/get_expenses.php?UserID=${user.UserID}`)
      .then((response) => setExpenses(response.data))
      .catch((error) => console.error("Error fetching expenses:", error));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!user) return; // Prevent error if user is undefined

    const expenseData = {
      UserID: user.UserID,
      ExpCategory: category,
      ExpAmount: amount,
      ExpDesc: description,
      ExpDate: new Date().toISOString().split("T")[0],
    };

    axios
      .post("https://craftipro.com/add_expense.php", expenseData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data);
        fetchExpenses();
        setCategory("");
        setAmount("");
        setDescription("");
      })
      .catch((error) => console.error("Error adding expense:", error));
  };

  return (
    <div className="expense-container">
      <h2>💰 Expense Tracking</h2>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="expense-form">
        <div className="form-group">
          <label>Expense Category</label>
          <input
            type="text"
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="custom-btn red">Add Expense</button>
      </form>

      {/* Expense List */}
      <h3>📜 Expense History</h3>
      <ul className="expense-list">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <li key={expense.ExpenseID} className="expense-item">
              <strong>{expense.ExpCategory}</strong>: ${expense.ExpAmount} - {expense.ExpDate}
              <p>{expense.ExpDesc}</p>
            </li>
          ))
        ) : (
          <p className="info-message">No expenses recorded.</p>
        )}
      </ul>
    </div>
  );
};

export default ExpenseTracking;




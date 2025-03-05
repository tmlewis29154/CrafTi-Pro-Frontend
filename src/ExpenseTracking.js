import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseTracking = ({ user }) => {  // ✅ Accept user as a prop
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user) fetchExpenses();  // ✅ Ensure user is defined before making API call
  }, [user]);

  const fetchExpenses = () => {
    if (!user) return;  // ✅ Prevent error if user is undefined

    axios.get(`https://craftipro.com/get_expenses.php?UserID=${user.UserID}`)
      .then(response => setExpenses(response.data))
      .catch(error => console.error("Error fetching expenses:", error));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!user) return;  // ✅ Prevent error if user is undefined

    const expenseData = {
      UserID: user.UserID, // ✅ Include UserID
      ExpCategory: category,
      ExpAmount: amount,
      ExpDesc: description,
      ExpDate: new Date().toISOString().split('T')[0]
    };

    axios.post("https://craftipro.com/add_expense.php", expenseData, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      console.log(response.data);
      fetchExpenses(); 
      setCategory('');
      setAmount('');
      setDescription('');
    })
    .catch(error => console.error("Error adding expense:", error));
  };

  return (
    <div className="container mt-4">
      <h2>💰 Expense Tracking</h2>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense}>
        <div className="mb-3">
          <label className="form-label">Expense Category</label>
          <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount ($)</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-danger">Add Expense</button>
      </form>

      {/* Expense List */}
      <h3 className="mt-4">📜 Expense History</h3>
      <ul className="list-group">
        {expenses.map(expense => (
          <li key={expense.ExpenseID} className="list-group-item">
            <strong>{expense.ExpCategory}</strong>: ${expense.ExpAmount} - {expense.ExpDate}
            <br />
            {expense.ExpDesc}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracking;



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddExpense.css'; // Import custom styles

const AddExpense = ({ user }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`https://craftipro.com/get_event.php?UserID=${user.UserID}&EventID=${eventId}`)
      .then(response => {
        if (response.data && response.data.EventDate) {
          setEventDate(response.data.EventDate);
        } else {
          console.error("Event Date not found for EventID:", eventId);
        }
      })
      .catch(error => console.error("Error fetching event date:", error));
  }, [eventId, user.UserID]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const expenseData = {
      UserID: user.UserID,
      EventID: eventId,
      ExpCategory: category,
      ExpAmount: amount,
      ExpDate: eventDate,
      ExpDesc: description
    };

    axios.post("https://craftipro.com/add_expense.php", expenseData, {
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        console.log("Expense added:", response.data);
        setMessage("Expense recorded successfully!");
        setCategory('');
        setAmount('');
        setDescription('');
        setTimeout(() => navigate('/manage-business/events'), 2000);
      })
      .catch(error => {
        console.error("Error adding expense:", error);
        setMessage("Failed to record expense.");
      });
  };

  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <h2>💰 Add Expense for Event #{eventId}</h2>
      </div>

      <div className="expense-card-body">
        <form onSubmit={handleAddExpense}>
          <div className="form-group">
            <label>Expense Category</label>
            <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">-- Select Category --</option>
              <option value="Supplies">Supplies</option>
              <option value="Travel">Travel</option>
              <option value="Event Fees">Event Fees</option>
              <option value="Marketing">Marketing</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input type="number" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Expense Date</label>
            <input type="date" className="input-field" value={eventDate} readOnly />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input type="text" className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <button type="submit" className="custom-btn">Add Expense</button>
        </form>

        {message && <div className="info-message">{message}</div>}
      </div>
    </div>
  );
};

export default AddExpense;




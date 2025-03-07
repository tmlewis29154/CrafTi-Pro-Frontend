import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddExpense = ({ user }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(''); // ✅ Store the EventDate
  const [message, setMessage] = useState('');

  // Fetch EventDate when the component loads
  useEffect(() => {
    axios.get(`https://craftipro.com/get_event.php?UserID=${user.UserID}&EventID=${eventId}`)
      .then(response => {
        if (response.data && response.data.EventDate) {
          setEventDate(response.data.EventDate); // Set EventDate from API
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
      ExpDate: eventDate, // Use fetched EventDate instead of today's date
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
    <div className="container mt-4">
      <h2>💰 Add Expense for Event #{eventId}</h2>

      <form onSubmit={handleAddExpense}>
        <div className="mb-3">
          <label className="form-label">Expense Category</label>
          <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">-- Select Category --</option>
            <option value="Supplies">Supplies</option>
            <option value="Travel">Travel</option>
            <option value="Event Fees">Event Fees</option>
            <option value="Marketing">Marketing</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Amount ($)</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Expense Date</label>
          <input type="date" className="form-control" value={eventDate} readOnly /> {/* Display EventDate but make it read-only */}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-danger">Add Expense</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default AddExpense;



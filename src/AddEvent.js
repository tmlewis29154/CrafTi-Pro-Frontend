import React, { useState } from 'react';
import axios from 'axios';  // ✅ Import axios

const AddEvent = ({ user, setRefresh }) => {  // ✅ Accept `user` as a prop
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.UserID) {
      setMessage("User not logged in. Please log in and try again.");
      return;
    }

    const eventData = { 
      UserID: user.UserID, // ✅ Include UserID
      EventName: name, 
      EventDate: date, 
      EventDesc: description 
    };

    try {
      console.log("Sending event data:", eventData);

      const response = await axios.post("https://craftipro.com/add_event.php", eventData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Server response:", response.data); // ✅ Log full response

      if (response.data.message === "Event added successfully") {
        setMessage("Event added successfully!");
        setName("");
        setDate("");
        setDescription("");

        // ✅ Refresh the dashboard to show the newly added event
        setTimeout(() => setRefresh(prev => !prev), 500);
      } else {
        console.error("Error from API:", response.data.error);
        setMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setMessage("Failed to add event. Please try again.");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>Add Event</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Add Event</button>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default AddEvent;

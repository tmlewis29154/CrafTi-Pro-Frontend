import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventManagement = ({ user }) => {  
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');  
  const [eventDate, setEventDate] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [message, setMessage] = useState('');

  console.log("User in EventManagement:", user);  // Debugging: Log user data

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("UserID is missing or undefined.");
      return;
    }
    fetchEvents();
  }, [user]);  

  const fetchEvents = () => {
    axios.get(`https://craftipro.com/get_event.php?UserID=${user.UserID}`)
      .then(response => {
        console.log("Fetched Events:", response.data);  
        setEvents(response.data);
      })
      .catch(error => console.error("Error fetching events:", error));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();

    if (!user || !user.UserID) {
      console.error("UserID is undefined when adding event.");  
      setMessage("Error: User is not logged in.");
      return;
    }

    const newEvent = {
      UserID: user.UserID,  
      EventName: eventName,
      EventDate: eventDate,
      EventDesc: eventDesc
    };

    axios.post("https://craftipro.com/add_event.php", newEvent, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      console.log("Add Event Response:", response.data);  
      if (response.data.message) {
        setMessage("Event added successfully!");
        fetchEvents(); 
        setEventName('');
        setEventDate('');
        setEventDesc('');
      } else {
        setMessage(`Error: ${response.data.error}`);
      }
    })
    .catch(error => {
      console.error("Error adding event:", error);
      setMessage("Failed to add event. Please try again.");
    });
  };

  // Function to Handle Event Deletion
  const handleDeleteEvent = (eventID) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    axios.get(`https://craftipro.com/delete_event.php?EventID=${eventID}`)
      .then(response => {
        console.log("Delete Event Response:", response.data);
        if (response.data.success) {
          setMessage("Event deleted successfully!");
          fetchEvents(); // Refresh the event list
        } else {
          setMessage("Error deleting event: " + response.data.error);
        }
      })
      .catch(error => {
        console.error("Error deleting event:", error);
        setMessage("Failed to delete event.");
      });
  };

  return (
    <div className="container mt-4">
      <h2>📅 Event Management</h2>

      {/* Add Event Form */}
      <form onSubmit={handleAddEvent} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Event Name</label>
          <input type="text" className="form-control" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Event Date</label>
          <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Add Event</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      {/* List of Events */}
      <h3 className="mt-4">Upcoming Events</h3>
      <ul className="list-group">
        {events.length > 0 ? (
          events.map(event => (
            <li key={event.EventID} className="list-group-item">
              <strong>{event.EventName}</strong> - {new Date(event.EventDate).toLocaleDateString()}
              <br />
              {event.EventDesc}
              <br />
              <a href={`/manage-business/events/${event.EventID}/record-sale`} className="btn btn-primary mt-2 me-2">
                Record Sale
              </a>
              <a href={`/manage-business/events/${event.EventID}/add-expense`} className="btn btn-danger mt-2 me-2">
                Add Expense
              </a>
              {/* Edit Event Button (Green) */}
              <a href={`/manage-business/events/${event.EventID}/edit`} className="btn btn-success mt-2 me-2">
                Edit Event
              </a>
              {/* Delete Event Button (Red) */}
              <button className="btn btn-outline-danger mt-2" onClick={() => handleDeleteEvent(event.EventID)}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-muted">No events found.</p>
        )}
      </ul>
    </div>
  );
};

export default EventManagement;








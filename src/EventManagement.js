import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventManagement.css"; // Import custom styles

const EventManagement = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [message, setMessage] = useState("");

  console.log("User in EventManagement:", user); // Debugging: Log user data

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("UserID is missing or undefined.");
      return;
    }
    fetchEvents();
  }, [user]);

  const fetchEvents = () => {
    axios
      .get(`https://craftipro.com/get_event.php?UserID=${user.UserID}`)
      .then((response) => {
        console.log("Fetched Events:", response.data);
        setEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
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
      EventDesc: eventDesc,
    };

    axios
      .post("https://craftipro.com/add_event.php", newEvent, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Add Event Response:", response.data);
        if (response.data.message) {
          setMessage("Event added successfully!");
          fetchEvents();
          setEventName("");
          setEventDate("");
          setEventDesc("");
        } else {
          setMessage(`Error: ${response.data.error}`);
        }
      })
      .catch((error) => {
        console.error("Error adding event:", error);
        setMessage("Failed to add event. Please try again.");
      });
  };

  // Function to Handle Event Deletion
  const handleDeleteEvent = (eventID) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    axios
      .get(`https://craftipro.com/delete_event.php?EventID=${eventID}`)
      .then((response) => {
        console.log("Delete Event Response:", response.data);
        if (response.data.success) {
          setMessage("Event deleted successfully!");
          fetchEvents(); // Refresh the event list
        } else {
          setMessage("Error deleting event: " + response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        setMessage("Failed to delete event.");
      });
  };

  return (
    <div className="event-management-container">
      <h2>📅 Event Management</h2>

      {/* Add Event Form */}
      <form onSubmit={handleAddEvent} className="event-form">
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            className="input-field"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            className="input-field"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="input-field"
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
          />
        </div>
        <button type="submit" className="custom-btn blue">Add Event</button>
      </form>

      {message && <div className="info-message">{message}</div>}

      {/* List of Events */}
      <h3>Upcoming Events</h3>
      <ul className="event-list">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.EventID} className="event-item">
              <div className="event-details">
                <strong>{event.EventName}</strong> - {new Date(event.EventDate).toLocaleDateString()}
                <p>{event.EventDesc}</p>
              </div>
              <div className="event-buttons">
                <a href={`/manage-business/events/${event.EventID}/record-sale`} className="custom-btn blue">
                  Record Sale
                </a>
                <a href={`/manage-business/events/${event.EventID}/add-expense`} className="custom-btn red">
                  Add Expense
                </a>
                <a href={`/manage-business/events/${event.EventID}/edit`} className="custom-btn green">
                  Edit Event
                </a>
                <button className="custom-btn outline-red" onClick={() => handleDeleteEvent(event.EventID)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="info-message">No events found.</p>
        )}
      </ul>
    </div>
  );
};

export default EventManagement;

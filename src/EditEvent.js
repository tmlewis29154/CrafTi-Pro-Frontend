import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditEvent.css"; // Import custom styles

const EditEvent = ({ user }) => {
  const { eventId } = useParams(); // Get EventID from URL
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("User not logged in.");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    fetchEventDetails();
  }, [user]);

  const fetchEventDetails = () => {
    axios
      .get(`https://craftipro.com/edit_event.php?EventID=${eventId}`)
      .then((response) => {
        if (response.data.error) {
          setMessage(response.data.error);
        } else {
          setEventName(response.data.EventName);
          setEventDate(response.data.EventDate);
          setEventDesc(response.data.EventDesc);
        }
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setMessage("Failed to fetch event details.");
      });
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();

    const updatedEvent = {
      EventID: eventId,
      EventName: eventName,
      EventDate: eventDate,
      EventDesc: eventDesc,
    };

    axios
      .post("https://craftipro.com/edit_event.php", updatedEvent, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.success) {
          setMessage("Event updated successfully!");
          navigate("/manage-business/events"); // Redirect after update
        } else {
          setMessage(`Error: ${response.data.error}`);
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        setMessage("Failed to update event.");
      });
  };

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>

      {message && <div className="info-message">{message}</div>}

      <form onSubmit={handleUpdateEvent} className="edit-event-form">
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

        <button type="submit" className="custom-btn green">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;


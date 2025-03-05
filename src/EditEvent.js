import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEvent = ({ user }) => {
  const { eventId } = useParams(); // ✅ Get EventID from URL
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
      .get(`https://craftipro.com/get_event_details.php?EventID=${eventId}`)
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
          navigate("/manage-business/events"); // ✅ Redirect after update
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
    <div className="container mt-4">
      <h2>Edit Event</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleUpdateEvent}>
        <div className="mb-3">
          <label className="form-label">Event Name</label>
          <input
            type="text"
            className="form-control"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Event Date</label>
          <input
            type="date"
            className="form-control"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;

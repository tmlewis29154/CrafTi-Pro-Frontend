import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeekAtaGlance.css";

const WeekAtaGlance = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("❌ User not found in WeekAtaGlance, skipping fetch.");
      return;
    }

    console.log("✅ WeekAtAGlance - Logged-in UserID:", user.UserID);
    fetchWeekDays();
    fetchEvents();
  }, [user]);

  const fetchWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Move to Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday

    let days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        fullDate: date.toISOString().split("T")[0], // Format YYYY-MM-DD
        displayDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }), // Example: "Mar 10"
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }), // Example: "Sun"
      });
    }
    setWeekDays(days);
  };

  const fetchEvents = () => {
    axios
      .get(`https://craftipro.com/get_event.php?UserID=${user.UserID}`)
      .then((response) => {
        console.log("✅ Raw API Response:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
          console.error("❌ API returned invalid JSON or empty:", response.data);
          setEvents([]);
          return;
        }

        filterEventsForCurrentWeek(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching events:", error.message);
        setEvents([]);
      });
  };

  const filterEventsForCurrentWeek = (allEvents) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Move to Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    const weekEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.EventDate + "T00:00:00");
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });

    console.log("✅ Filtered Week Events:", weekEvents);
    setEvents(weekEvents);
  };

  const groupEventsByDate = () => {
    const grouped = {};
    events.forEach((event) => {
      const eventDate = event.EventDate;
      if (!grouped[eventDate]) {
        grouped[eventDate] = [];
      }
      grouped[eventDate].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();

  return (
    <div className="week-calendar-container">
      <h3 className="text-center fw-bold text-primary">📅 Week at a Glance</h3>
      <div className="week-grid">
        {weekDays.map(({ fullDate, displayDate, dayName }) => (
          <div key={fullDate} className="day-column">
            <h5 className="day-header">
              {dayName} - {displayDate}
            </h5>
            <ul className="event-list">
              {groupedEvents[fullDate]?.length > 0 ? (
                groupedEvents[fullDate].map((event) => (
                  <li key={event.EventID} className="event-item">
                    <strong>{event.EventName}</strong>
                    <p className="event-desc">{event.EventDesc}</p>
                  </li>
                ))
              ) : (
                <p className="no-event">No events</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Move export outside of the return block
export default WeekAtaGlance;

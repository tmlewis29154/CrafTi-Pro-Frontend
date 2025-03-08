import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeekAtaGlance.css";

const WeekAtaGlance = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("❌ User not found in WeekAtaGlance, skipping fetch.");
      return;
    }

    console.log("✅ WeekAtAGlance - Logged-in UserID:", user.UserID);
    fetchWeekDays();
    fetchEvents();

    // Responsive Layout - Track Window Resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user]);

  const fetchWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Move to Sunday
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        fullDate: date.toISOString().split("T")[0], // Format YYYY-MM-DD
        displayDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      };
    });
    setWeekDays(days);
  };

  const fetchEvents = () => {
    axios
      .get(`https://craftipro.com/get_event.php?UserID=${user.UserID}`)
      .then((response) => {
        console.log("✅ Raw API Response:", response.data);

        if (!Array.isArray(response.data)) {
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
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.EventDate + "T00:00:00");
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });

    console.log("✅ Filtered Week Events:", weekEvents);
    setEvents(weekEvents);
  };

  const groupEventsByDate = () => {
    return events.reduce((grouped, event) => {
      grouped[event.EventDate] = grouped[event.EventDate] || [];
      grouped[event.EventDate].push(event);
      return grouped;
    }, {});
  };

  const groupedEvents = groupEventsByDate();

  return (
    <div className="week-calendar-container">
      <h3 className="week-title">📅 Week at a Glance</h3>
      <div className={`week-grid ${windowWidth < 768 ? "mobile-grid" : ""}`}>
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

export default WeekAtaGlance;


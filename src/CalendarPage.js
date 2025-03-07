import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const CalendarPage = ({ user }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("UserID is missing or undefined.");
      return;
    }

    axios.get(`https://craftipro.com/get_event.php?UserID=${user.UserID}`)
      .then(response => {
        console.log("Fetched Events for Calendar:", response.data);
        if (Array.isArray(response.data)) {
          const formattedEvents = response.data.map(event => ({
            id: event.EventID,
            title: event.EventName,
            start: event.EventDate, 
            extendedProps: {
              description: event.EventDesc
            }
          }));
          setEvents(formattedEvents);
        } else {
          console.error("Invalid API response, expected an array:", response.data);
        }
      })
      .catch(error => console.error("Error fetching calendar events:", error));
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>📆 Event Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={info => alert(info.event.extendedProps.description)} // Click event shows description
      />
    </div>
  );
};

export default CalendarPage;






'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // DayGrid View
import timeGridPlugin from '@fullcalendar/timegrid'; // TimeGrid View
import interactionPlugin from '@fullcalendar/interaction'; // Drag and Drop
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function ModernCalendar() {
  const [events, setEvents] = useState([]);
   const praticienID = useSelector((state: RootState) => state.practitioner.id);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
      `http://localhost:3000/calendar/upcoming-appointments?praticienId=${praticienID}`
      );
      const data = await response.json();

      if (response.ok) {
        const formattedEvents = data.events.map((event: any) => ({
          id: event.id,
          title: event.summary,
          start: event.start.dateTime,
          end: event.end.dateTime,
        }));
        setEvents(formattedEvents);
      } else {
        console.error('Erreur lors de la récupération des rendez-vous :', data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous :', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (info: any) => {
    alert(`Événement : ${info.event.title}\nDébut : ${info.event.start}\nFin : ${info.event.end}`);
  };

  return (
    <div className="p-6 text-black bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Calendrier</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventClick={handleEventClick}
          height="700px"
        />
      </div>
    </div>
  );
}
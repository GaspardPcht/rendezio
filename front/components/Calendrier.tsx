'use client';

import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const localizer = momentLocalizer(moment);

export default function DashboardCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/calendar/upcoming-appointments?praticienId=675071ebda842be512fb980d'
      );
      const data = await response.json();

      if (response.ok) {
        const formattedEvents = data.events.map((event: any) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
        }));
        setEvents(formattedEvents);
      } else {
        console.error('Erreur lors de la récupération des rendez-vous :', data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Calendrier des Rendez-vous</h1>
      {loading ? (
        <p className="text-gray-500">Chargement des événements...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6" style={{ width: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700, width: '100%' }}
            messages={{
              next: 'Suivant',
              previous: 'Précédent',
              today: 'Aujourd\'hui',
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
            }}
          />
        </div>
      )}
    </div>
  );
}
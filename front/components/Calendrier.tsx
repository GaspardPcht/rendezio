'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useSelector } from 'react-redux';
import { Modal } from 'antd'; // Import Ant Design Modal
import { RootState } from '../store/store';
import Button from './Button';

export default function ModernCalendar() {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const praticienID = useSelector((state: RootState) => state.practitioner.id);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/calendar/upcoming-appointments?praticienId=${praticienID}`
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
        console.error(
          'Erreur lors de la récupération des rendez-vous :',
          data.error
        );
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous :', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
    });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
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

      {/* Modal */}
      <Modal
        title="Détails de l'événement"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={handleCloseModal}
        footer={null}
        centered
      >
        {selectedEvent && (
          <div>
            <p>
              <strong>Titre :</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Début :</strong>{' '}
              {new Date(selectedEvent.start).toLocaleString()}
            </p>
            <p>
              <strong>Fin :</strong>{' '}
              {new Date(selectedEvent.end).toLocaleString()}
            </p>
          </div>
        )}
        <div className="flex justify-end" onClick={handleCloseModal}>
          <Button text="OK" />
        </div>
      </Modal>
    </div>
  );
}

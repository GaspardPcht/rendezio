'use client';
import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

interface HistoryAppointment {
  id: string;
  date: string;
  time: string;
  practitioner: string;
  service: string;
  location: string;
  status: string;
  notes?: string;
}

export default function History() {
  const [appointments, setAppointments] = useState<HistoryAppointment[]>([
    {
      id: '1',
      date: '2024-02-15',
      time: '10:30',
      practitioner: 'Dr. Smith',
      service: 'Consultation standard',
      location: '123 Rue de la Santé, Paris',
      status: 'completed',
      notes: 'Rendez-vous de suivi régulier'
    },
    // Ajoutez d'autres rendez-vous passés ici
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Historique</h1>
        <p className="text-gray-500 mb-8">Consultez l'historique de vos rendez-vous passés</p>

        <div className="bg-white rounded-xl shadow-sm">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-gray-400 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appointment.practitioner}
                    </h3>
                    <p className="text-gray-500">{appointment.service}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-gray-400">
                        <FaClock className="mr-2" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="mt-2 text-sm text-gray-500">
                        Note: {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">
                    {new Date(appointment.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
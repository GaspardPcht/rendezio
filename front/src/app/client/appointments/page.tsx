'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

interface Appointment {
  id: string;
  date: string;
  time: string;
  practitioner: string;
  service: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function Appointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2024-03-20',
      time: '14:30',
      practitioner: 'Dr. Smith',
      service: 'Consultation standard',
      location: '123 Rue de la Santé, Paris',
      status: 'upcoming'
    },
    // Ajoutez d'autres rendez-vous ici
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'À venir';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mes rendez-vous</h1>
            <p className="text-gray-500">Gérez vos rendez-vous à venir et passés</p>
          </div>
          <button
            onClick={() => router.push('/reservation/bookCalendar')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Nouveau rendez-vous
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-500 text-2xl" />
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
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                  <button
                    onClick={() => router.push(`/client/appointments/${appointment.id}`)}
                    className="px-4 py-2 text-blue-500 hover:text-blue-600"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
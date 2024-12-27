'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../../../reducers/praticien';
import { RootState } from '../../../../store/store';

interface Appointment {
  id: string;
  summary: string;
  description?: string; // La description peut être facultative
  start: { dateTime: string };
  end: { dateTime: string };
}

export default function UpcomingAppointments() {
  const id = useSelector((state: RootState) => state.practitioner.id);
  const token = useSelector((state: RootState) => state.practitioner.token);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      router.push('/admin'); // Redirection si le token est absent
    } else {
      dispatch(setToken(token)); // S'assurer que le token est bien défini
    }
  }, [token, router, dispatch]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/calendar/upcoming-appointments?praticienId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ajout du token pour les requêtes sécurisées
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setAppointments(data.events);
        } else {
          console.error('Erreur lors de la récupération des rendez-vous :', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous :', error);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchAppointments();
  }, [id, token]);

  const cleanDescription = (description?: string): string => {
    if (!description) return 'Pas de description disponible';
    return description.replace(/^Consultation avec .*?\n/, '').trim();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        Rendez-vous à venir
      </h1>
      {loading ? (
        <p className="text-gray-500">Chargement des rendez-vous...</p>
      ) : appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="p-4 bg-white rounded shadow-md">
              <h2 className="text-lg font-semibold text-gray-800">
                {appointment.summary}
              </h2>
              <p className="text-gray-600">{cleanDescription(appointment.description)}</p>
              <p className="text-gray-500">
                Début : {new Date(appointment.start.dateTime).toLocaleString()}
              </p>
              <p className="text-gray-500">
                Fin : {new Date(appointment.end.dateTime).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucun rendez-vous à venir.</p>
      )}
    </div>
  );
}
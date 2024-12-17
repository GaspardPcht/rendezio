'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../../../reducers/praticien';
import { RootState } from '../../../../store/store';

interface Appointment {
  id: string;
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export default function UpcomingAppointments() {
  const id = useSelector((state: RootState) => state.practitioner.id);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const praticienId = id;
  const router = useRouter();
  const dispatch = useDispatch(); // Initialiser le dispatch pour Redux



  const token = useSelector((state: RootState) => state.practitioner.token);

  useEffect(() => {
    if (!token) {
      // Si le token est absent, rediriger vers la page de connexion
      router.push('/admin');
    } else {
      // S'assurer que le token est bien défini dans le reducer (si nécessaire)
      dispatch(setToken(token));
    }
  }, [token, router, dispatch]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/calendar/upcoming-appointments?praticienId=${praticienId}`
        );
        const data = await response.json();

        if (response.ok) {
          setAppointments(data.events);
        } else {
          console.error(
            'Erreur lors de la récupération des rendez-vous :',
            data.error
          );
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des rendez-vous :',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fonction pour supprimer la phrase "Consultation avec ..."
  const cleanDescription = (description: string): string => {
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
          {appointments.map((appointment) => {
            const cleanedDescription = cleanDescription(
              appointment.description
            ); // Nettoyer la description
            return (
              <li
                key={appointment.id}
                className="p-4 bg-white rounded shadow-md"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {appointment.summary}
                </h2>
                <p className="text-gray-600">{cleanedDescription}</p>
                <p className="text-gray-500">
                  Début :{' '}
                  {new Date(appointment.start.dateTime).toLocaleString()}
                </p>
                <p className="text-gray-500">
                  Fin : {new Date(appointment.end.dateTime).toLocaleString()}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">Aucun rendez-vous à venir.</p>
      )}
    </div>
  );
}

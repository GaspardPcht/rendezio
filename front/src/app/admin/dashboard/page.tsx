'use client';

import React, { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import { useRouter } from 'next/navigation';
import DashboardCalendar from '../../../../components/Calendrier';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../../../reducers/praticien';
import { RootState } from '../../../../store/store';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.practitioner.token);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const praticienID = useSelector((state: RootState) => state.practitioner.id);


    const checkGoogleConnection = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/calendar/check-google-connection?praticienId=${praticienID}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
  
        if (response.ok && data.connected) {
          setIsGoogleConnected(true);
        } else {
          // Redirige l'utilisateur pour lier son compte Google
          window.location.href = 'http://localhost:3000/calendar/auth/google';
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion Google :', error);
        // En cas d'erreur, redirige aussi vers la liaison Google
        window.location.href = 'http://localhost:3000/calendar/auth/google';
      }
    };
  
    // if (token) {
    //   checkGoogleConnection();
    // } else {
    //   router.push('/admin'); // Si aucun token, redirige vers la page de connexion
    // }


  const handleClick = () => {
    router.push('/admin/allClients');
  };

  const handleLinkGoogle = () => {
    window.location.href = 'http://localhost:3000/calendar/auth/google';
  };

  const handleClicks = () => {
    router.push('/admin/calendar');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* En-tête */}
      <header className="bg-white shadow-md p-4 mb-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Rendezio</h1>
        <p className="text-gray-600">Gérez vos rendez-vous et suivez vos statistiques.</p>
      </header>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between lg:space-x-6 space-y-6 lg:space-y-0">
        {/* Colonne gauche */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Carte 1 : Rendez-vous */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">Rendez-vous à venir</h2>
            <p className="text-gray-600 mt-2">
              Vous avez <span className="font-bold">5 rendez-vous</span> prévus cette semaine.
            </p>
            <div className="mt-4">
              <Button text="Voir mes rendez-vous" onClick={handleClicks} />
            </div>
            <button
              onClick={checkGoogleConnection}
              className="mt-4 text-blue-500 underline"
            >
              Lier mon compte Google Calendar
            </button>
          </div>

          {/* Carte 2 : Statistiques */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">Statistiques</h2>
            <p className="text-gray-600 mt-2">
              Taux de réservation : <span className="font-bold">85%</span>
            </p>
            <div className="mt-4">
              <Button
                text="Voir les détails"
                onClick={() => alert('Voir les détails')}
              />
            </div>
          </div>
        </div>

        {/* Colonne centrale */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 max-w-[900px]">
          {isGoogleConnected ? (
            <DashboardCalendar />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-700 text-center mb-4">
                Connectez votre compte Google pour afficher vos rendez-vous.
              </p>
              <Button text="Lier mon compte Google Calendar" onClick={handleLinkGoogle} />
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Carte 3 : Mes clients */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">Mes clients</h2>
            <p className="text-gray-600 mt-2">Voir la totalité de mes clients.</p>
            <div className="mt-4">
              <Button text="Lire les avis" onClick={handleClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
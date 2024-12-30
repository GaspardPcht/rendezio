'use client';

import React, { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import { useRouter } from 'next/navigation';
import DashboardCalendar from '../../../../components/Calendrier';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

export default function Dashboard() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.practitioner.token);
  const praticienId = useSelector((state: RootState) => state.practitioner.id);

  console.log('Token :', token);
  console.log('PraticienId :', praticienId);
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenn = urlParams.get('token');

    const checkGoogleConnection = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_BACKEND}/calendar/check-google-connection?praticienId=${praticienId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log('Data :', data);
        if (response.ok && data.connected) {
          setIsGoogleConnected(true);
        } else {
          setIsGoogleConnected(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion Google :', error);
        setIsGoogleConnected(false);
      }
    };

    if (token || tokenn) {
      checkGoogleConnection();
    } else {
      console.error('Token ou praticienId manquant');
      router.push('/admin');
    }
    window.history.replaceState({}, document.title, '/admin/dashboard');
  }, [token, praticienId]);

  const handleGoogleConnection = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL_BACKEND}/calendar/auth/google?praticienId=${praticienId}`;
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
              <Button text="Voir mes rendez-vous" onClick={() => router.push('/admin/calendar')} />
            </div>
          </div>

          {/* Carte 2 : Statistiques */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">Statistiques</h2>
            <p className="text-gray-600 mt-2">
              Taux de réservation : <span className="font-bold">85%</span>
            </p>
            <div className="mt-4">
              <Button text="Voir les détails" onClick={() => alert('Ça arrive pas de panique')} />
            </div>
          </div>
        </div>

        {/* Colonne centrale */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 max-w-[900px]">
          {isGoogleConnected === null ? (
            <p className="text-gray-700 text-center">Chargement...</p>
          ) : isGoogleConnected ? (
            <DashboardCalendar />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-700 text-center mb-4">
                Connectez votre compte Google pour afficher vos rendez-vous.
              </p>
              <Button text="Lier mon compte Google Calendar" onClick={handleGoogleConnection} />
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
              <Button text="Lire les avis" onClick={() => router.push('/admin/allClients')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
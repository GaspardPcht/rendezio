'use client';
import React from 'react';
import Button from '../../../../components/Button';
import { useRouter } from 'next/navigation';
import DashboardCalendar from '../../../../components/Calendrier';

export default function Dashboard() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/admin/allClients');
  };

  const handleLinkGoogle = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleClicks = () => {
    router.push('/admin/calendar');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* En-tête */}
      <header className="bg-white shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Rendezio</h1>
        <p className="text-gray-600">
          Gérez vos rendez-vous et suivez vos statistiques
        </p>
      </header>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Colonne gauche */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Carte 1 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Rendez-vous à venir
            </h2>
            <p className="text-gray-600 mt-2">
              Vous avez 5 rendez-vous prévus cette semaine.
            </p>
            <div className="mt-4">
              <Button text="Voir mes rendez-vous" onClick={handleClicks} />
            </div>
            <button
              onClick={handleLinkGoogle}
              className="mt-4 text-blue-500 underline"
            >
              Lier mon compte Google Calendar
            </button>
          </div>

          {/* Carte 2 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800">Statistiques</h2>
            <p className="text-gray-600 mt-2">Taux de réservation : 85%</p>
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
          <DashboardCalendar />
        </div>

        {/* Colonne droite */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Carte 3 */}
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
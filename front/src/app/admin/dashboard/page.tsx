'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCalendar from '../../../../components/Calendrier';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import ConnexionGoogleAdmin from '../../../../components/ConnexionGoogleAdmin';
import { FaCalendarAlt, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.practitioner.token);
  const praticienId = useSelector((state: RootState) => state.practitioner.id);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Rendezio</h1>
          <p className="text-sm text-gray-500">Dashboard Administrateur</p>
        </div>
        
        <nav className="space-y-4">
          <button 
            onClick={() => router.push('/admin/calendar')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaCalendarAlt className="mr-3" />
            Calendrier
          </button>
          
          <button 
            onClick={() => router.push('/admin/allClients')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaUsers className="mr-3" />
            Mes Clients
          </button>
          
          <button 
            onClick={() => alert('Bientôt disponible')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaChartLine className="mr-3" />
            Statistiques
          </button>
          
          <button 
            onClick={() => router.push('/admin/settings')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaCog className="mr-3" />
            Paramètres
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Tableau de bord</h2>
          <p className="text-gray-500">Bienvenue sur votre espace administrateur</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Rendez-vous aujourd'hui</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaCalendarAlt className="text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">5</p>
            <p className="text-sm text-green-500">+2 par rapport à hier</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Clients actifs</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <FaUsers className="text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">124</p>
            <p className="text-sm text-green-500">+12% ce mois</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Taux de remplissage</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <FaChartLine className="text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">85%</p>
            <p className="text-sm text-green-500">+5% cette semaine</p>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Planning</h3>
          {isGoogleConnected === null ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : isGoogleConnected ? (
            <DashboardCalendar />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-600 text-center mb-4">
                Connectez votre compte Google pour synchroniser votre calendrier
              </p>
              <ConnexionGoogleAdmin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
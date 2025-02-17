'use client';
import React, { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import ConnexionGoogleClients from '../../../../components/ConnexionGoogleClients';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { useDispatch } from 'react-redux';
import { setUser, resetUser } from '../../../../reducers/user';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaClock, FaBell, FaHistory, FaHeart } from 'react-icons/fa';
import Image from 'next/image';

interface Appointment {
  id: string;
  date: string;
  time: string;
  practitioner: string;
  service: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function ClientDashboard() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [favoritesPractitioners, setFavoritesPractitioners] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();

  // Fonction native pour décoder un JWT
  const decodeJwt = (token: any) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du JWT :', error);
      return null;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      const userInfo = decodeJwt(token);

      if (userInfo) {
        const userPayload = {
          email: userInfo.email || 'unknown@email.com',
          name: userInfo.firstName || 'Unknown',
          token: token,
        };

        // Mettre à jour Redux
        dispatch(setUser(userPayload));

        // Sauvegarder les infos dans localStorage
        localStorage.setItem('user', JSON.stringify(userPayload));
      } else {
        console.error(
          'Erreur : aucune information utilisateur trouvée dans le JWT.'
        );
      }

      // Nettoyer l'URL pour retirer le token
      window.history.replaceState({}, document.title, '/client/dashboard');
    } else {
      // Récupérer les informations depuis localStorage si elles existent
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        dispatch(setUser(JSON.parse(savedUser)));
      } else {
        console.warn('Aucune information utilisateur trouvée.');
      }
    }
  }, [dispatch]);

  // Simuler le chargement des données
  useEffect(() => {
    // Ici vous mettrez votre vraie logique de chargement des données
    setNextAppointment({
      id: '1',
      date: '2024-03-20',
      time: '14:30',
      practitioner: 'Dr. Smith',
      service: 'Consultation standard',
      status: 'upcoming'
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(resetUser());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Rendezio</h1>
          <p className="text-sm text-gray-500">Espace Client</p>
        </div>

        {/* Profil utilisateur */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xl text-white font-semibold">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="space-y-4">
          <button 
            onClick={() => router.push('/client/appointments')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaCalendarAlt className="mr-3" />
            Mes rendez-vous
          </button>
          
          <button 
            onClick={() => router.push('/client/profile')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaUser className="mr-3" />
            Mon profil
          </button>
          
          <button 
            onClick={() => router.push('/client/history')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaHistory className="mr-3" />
            Historique
          </button>
          
          <button 
            onClick={() => router.push('/client/favorites')}
            className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <FaHeart className="mr-3" />
            Favoris
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header with notifications */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Bonjour, {user.name}</h2>
            <p className="text-gray-500">Voici un aperçu de vos rendez-vous</p>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-blue-600">
            <FaBell size={24} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Prochain rendez-vous */}
        {nextAppointment && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Prochain rendez-vous</h3>
              <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                À venir
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaClock className="text-blue-500 text-2xl" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">{nextAppointment.practitioner}</p>
                <p className="text-gray-500">{nextAppointment.service}</p>
                <p className="text-sm text-gray-400">
                  {new Date(nextAppointment.date).toLocaleDateString()} à {nextAppointment.time}
                </p>
              </div>
              <button
                onClick={() => router.push(`/client/appointments/${nextAppointment.id}`)}
                className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Voir les détails
              </button>
            </div>
          </div>
        )}

        {/* Stats et actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Rendez-vous ce mois</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaCalendarAlt className="text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">3</p>
            <button 
              onClick={() => router.push('/reservation/bookCalendar')}
              className="mt-4 text-sm text-blue-500 hover:text-blue-600"
            >
              Prendre un rendez-vous →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Praticiens favoris</h3>
              <div className="p-2 bg-red-50 rounded-lg">
                <FaHeart className="text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">2</p>
            <button 
              onClick={() => router.push('/client/favorites')}
              className="mt-4 text-sm text-blue-500 hover:text-blue-600"
            >
              Voir mes favoris →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Rendez-vous passés</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <FaHistory className="text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">8</p>
            <button 
              onClick={() => router.push('/client/history')}
              className="mt-4 text-sm text-blue-500 hover:text-blue-600"
            >
              Voir l'historique →
            </button>
          </div>
        </div>

        {/* Derniers rendez-vous */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Derniers rendez-vous</h3>
          <div className="space-y-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{appointment.practitioner}</p>
                      <p className="text-sm text-gray-500">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Aucun rendez-vous récent</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

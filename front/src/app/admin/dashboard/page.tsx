'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { setToken, setId } from '../../../../reducers/praticien';
import Button from '../../../../components/Button';
import DashboardCalendar from '../../../../components/Calendrier';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.practitioner.token);
  const praticienId = useSelector((state: RootState) => state.practitioner.id);

  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlPraticienId = params.get('praticienId');

    console.log("Token récupéré :", urlToken);
    console.log("PraticienId récupéré :", urlPraticienId);

    if (urlToken) {
      dispatch(setToken(urlToken));
    }

    if (urlPraticienId) {
      dispatch(setId(urlPraticienId));
    }

    // if (!urlToken || !urlPraticienId) {
    //   console.log("Token ou praticienId manquant, redirection vers /signin");
    //   router.push('/admin');
    // }
  }, [dispatch, router]);

  useEffect(() => {
    const checkGoogleConnection = async () => {
      console.log("Vérification de la connexion Google...");
      try {
        const response = await fetch(
          `http://localhost:3000/calendar/check-google-connection?praticienId=${praticienId}`,
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
          setIsGoogleConnected(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification Google :", error);
        setIsGoogleConnected(false);
      }
    };

    if (token && praticienId) {
      checkGoogleConnection();
    }
  }, [token, praticienId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md p-4 mb-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Rendezio</h1>
      </header>

      <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
        {isGoogleConnected === null ? (
          <p>Chargement...</p>
        ) : isGoogleConnected ? (
          <DashboardCalendar />
        ) : (
          <Button
            text="Lier mon compte Google Calendar"
            onClick={() =>
              (window.location.href = `http://localhost:3000/calendar/auth/google?praticienId=${praticienId}`)
            }
          />
        )}
      </div>
    </div>
  );
}
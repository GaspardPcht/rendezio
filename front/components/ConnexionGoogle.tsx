'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


export default function ConnexionGoogle() {

  const praticienId = useSelector((state: RootState) => state.practitioner.id);

  const handleGoogleConnect = () => {
    // Redirige vers la route d'authentification Google
    window.location.href = `${process.env.NEXT_PUBLIC_URL_BACKEND}/calendar/auth/google?praticienId=${praticienId}`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleConnect}
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      Connectez-vous avec Google
    </button>
  );
}
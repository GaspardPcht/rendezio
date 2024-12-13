'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


export default function ConnexionGoogle() {

 // const praticienId = useSelector((state: RootState) => state.practitioner.id);
  const praticienId = '675878d0898a8c201f75e33c'

  const handleGoogleConnect = () => {
    // Redirige vers la route d'authentification Google
    window.location.href = `http://localhost:3000/users/auth/google`;
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
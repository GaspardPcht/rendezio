'use client';
import React from 'react';

export default function ConnexionGoogle() {
  const handleGoogleConnect = () => {
    // Redirige vers la route d'authentification Google
    window.location.href = 'http://localhost:3000/calendar/auth/google';
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
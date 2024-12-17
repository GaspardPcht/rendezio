'use client';

import React from 'react';

export default function ConfirmationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-500 mb-4">Merci pour votre rendez-vous !</h1>
        <p className="text-gray-700 mb-6">
          Votre rendez-vous a bien été pris en compte. Vous recevrez un e-mail de confirmation
          contenant les détails de votre réservation.
        </p>
        <p className="text-gray-500">
          En cas de problème ou pour toute question, n'hésitez pas à nous contacter.
        </p>
        <button
          className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
          onClick={() => window.location.href = '/client/dashboard'}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
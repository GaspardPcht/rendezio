'use client';
import React from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/user';

export default function ConnexionGoogleClients() {
  const dispatch = useDispatch();

  const handleGoogleConnect = () => {
    // Redirige l'utilisateur vers la route d'authentification Google
    window.location.href = 'http://localhost:3000/users/auth/google';
  };

  return (
    <button
      type="button"
      onClick={handleGoogleConnect}
      className="flex items-center bg-[#EAEAEA] text-black font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <Image
        src="/Logo/logo-google.png" 
        alt="Google Logo"
        width={24}
        height={24}
        className="mr-2"
      />
      Connectez-vous avec Google
    </button>
  );
}
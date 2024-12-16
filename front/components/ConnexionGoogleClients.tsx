'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/user';

export default function ConnexionGoogleClients() {
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

  const handleGoogleConnect = () => {
    // Redirige l'utilisateur vers la route d'authentification Google
    window.location.href = 'http://localhost:3000/users/auth/google';
  };

  useEffect(() => {
    // Récupérer le token dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      const userInfo = decodeJwt(token);
      if (userInfo) {
        console.log('User Info:', userInfo);
        // Dispatch dans Redux
        dispatch(setUser(userInfo));
      }

      // Nettoyer l'URL pour retirer le token
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [dispatch]);

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
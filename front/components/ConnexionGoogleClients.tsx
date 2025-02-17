'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ConnexionGoogleClients() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;

  useEffect(() => {
    const fetchAuthUrl = async () => {
      if (!backendUrl) {
        console.error('NEXT_PUBLIC_URL_BACKEND non défini');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/users/auth/google/url`);
        const data = await response.json();
        if (data.url) {
          setAuthUrl(data.url);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'URL d\'authentification:', error);
      }
    };

    fetchAuthUrl();
  }, [backendUrl]);

  if (!authUrl) {
    return null;
  }

  return (
    <a
      href={authUrl}
      className="inline-flex items-center bg-[#EAEAEA] text-black font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <Image
        src="/Logo/logo-google.png"
        alt="Google Logo"
        width={24}
        height={24}
        className="mr-2"
      />
      Connectez-vous avec Google
    </a>
  );
}
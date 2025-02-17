'use client';
import Image from 'next/image';

export default function ConnexionGoogleAdmin() {
  const handleGoogleConnect = async () => {
    try {
      console.log('Tentative de connexion Google...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/praticien/auth/google/url`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'URL Google');
      }

      const data = await response.json();
      console.log('URL reçue:', data.url);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de redirection manquante');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    }
  };

  return (
    <button
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
      Connecter Google Calendar
    </button>
  );
} 
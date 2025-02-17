'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {
  const handleGoogleConnect = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;
      console.log('Backend URL:', backendUrl); // Vérifier l'URL du backend
      
      // Appeler la route pour obtenir l'URL d'authentification
      console.log('Tentative de fetch vers:', `${backendUrl}/users/auth/google/url`);
      const response = await fetch(`${backendUrl}/users/auth/google/url`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Statut de la réponse:', response.status);
      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (data.url) {
        console.log('URL de redirection:', data.url);
        window.location.href = data.url;
      } else {
        console.error('URL de redirection non reçue');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
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
      Connectez-vous avec Google
    </button>
  );
}
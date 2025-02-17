'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {
  const handleGoogleConnect = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;
      console.log('Backend URL:', backendUrl); // Pour le débogage
      
      const response = await fetch(`${backendUrl}/users/auth/google/url`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('URL reçue:', data.url); // Pour le débogage
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de redirection non reçue');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      // En cas d'erreur, redirection vers la page de connexion
      window.location.href = 'https://rendezio-frontend.vercel.app/auth/signin?error=connection_failed';
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
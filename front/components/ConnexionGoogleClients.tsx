'use client';
import Image from 'next/image';

export default function ConnexionGoogleClients() {
  const handleGoogleConnect = () => {
    // ID client en dur pour le débogage
    const clientId = '776442664763-bk27evcc5s2j6oqofbrkprk1thmba2n0.apps.googleusercontent.com';
    
    // Utiliser l'URL du backend depuis les variables d'environnement
    const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;
    const redirectUri = `${backendUrl}/users/auth/google/callback`;
    
    const scope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar',
      'openid'
    ].join(' ');

    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const searchParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope,
      access_type: 'offline',
      prompt: 'consent'
    });

    // Rediriger vers le backend pour l'authentification
    window.location.href = `${backendUrl}/users/auth/google`;
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